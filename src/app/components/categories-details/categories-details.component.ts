import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  combineLatest,
  of,
  shareReplay,
  startWith,
  take,
  tap,
} from 'rxjs';
import { SortOrderQueryModel } from '../../query-models/sort-order.query-model';
import { CategoryModel } from '../../models/category.model';
import { FreshProductsDetailedQueryModel } from '../../query-models/fresh-products-detailed.query-model';
import { InMemoryCategoriesStorage } from '../../storages/categories/in-memory-categories.storage';
import { FreshProductsService } from '../../services/fresh-products.service';
import { FreshProductsModel } from '../../models/fresh-products.model';
import { map } from 'rxjs/operators';
import { FiltersFreshProductsQueryModel } from '../../query-models/filters-fresh-products.query-model';
import { StarsFilterDataQueryModel } from '../../query-models/stars-filter-data.query-model';
import { InMemoryStoresStorage } from '../../storages/stores/in-memory-stores.storage';
import { StoreFilterQueryModel } from '../../query-models/store-filter.query-model';

@Component({
  selector: 'app-categories-details',
  templateUrl: './categories-details.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesDetailsComponent {
  readonly stores$: Observable<StoreFilterQueryModel[]> = this._storesStorage
    .select()
    .pipe(
      map((stores) =>
        stores.map((store) => ({ id: store.id, name: store.name }))
      ),
      shareReplay(1)
    );

  readonly sortForm: FormControl = new FormControl('featureValueDesc');
  readonly sort$: Observable<string> = this.sortForm.valueChanges.pipe(
    startWith('featureValueDesc')
  );

  readonly sortOptions$: Observable<SortOrderQueryModel[]> = of([
    { name: 'Featured', value: 'featureValueDesc' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
    { name: 'Avg Rating', value: 'ratingDesc' },
  ]);
  readonly pageSizes$: Observable<number[]> = of([5, 10, 15]);
  readonly pagination$: Observable<{ pageNumber: number; pageSize: number }> =
    this._activatedRoute.queryParams.pipe(
      map((params) => {
        return {
          pageNumber: params['pageNumber'] ? +params['pageNumber'] : 1,
          pageSize: params['pageSize'] ? +params['pageSize'] : 5,
        };
      }),
      startWith({ pageNumber: 1, pageSize: 5 }),
      shareReplay(1)
    );

  readonly categoryId$: Observable<string> = this._activatedRoute.params.pipe(
    map((params) => params['categoryId'])
  );
  readonly categories$: Observable<CategoryModel[]> = this._categoriesStorage
    .select()
    .pipe(shareReplay(1));
  readonly categoriesNames$: Observable<string[]> = this.categories$.pipe(
    map((categories) => categories.map((category) => category.name))
  );

  readonly filtersForm: FormGroup = new FormGroup({
    priceFrom: new FormControl(),
    priceTo: new FormControl(),
    minRatingValue: new FormControl(),
    storeIds: new FormControl(),
  });

  readonly storeSearchForm: FormControl = new FormControl();
  readonly storeSearch$ = combineLatest([
    this.stores$,
    this.storeSearchForm.valueChanges,
  ]).pipe(
    startWith([]),
    map(([stores, storeName]) => {
      return stores?.reduce((acc, c) => {
        if (c.name.toLowerCase().includes(storeName.toLowerCase().trim())) {
          return [...acc, c.id];
        }
        return [...acc];
      }, [] as string[]);
    })
  );

  readonly filters$: Observable<any> = this.filtersForm.valueChanges.pipe(
    startWith({
      priceFrom: 0,
      priceTo: 100000,
      minRatingValue: 0,
      storeIds: [],
    }),
    shareReplay(1)
  );

  readonly currentPageCategoryName$: Observable<string> = combineLatest([
    this.categories$,
    this.categoryId$,
  ]).pipe(
    map(([categories, categoryId]) =>
      this._findCategoryNameById(categoryId, categories)
    )
  );
  readonly freshProducts$: Observable<FreshProductsDetailedQueryModel[]> =
    combineLatest([
      this._freshProductsService.getAll(),
      this.categoryId$,
      this.sort$,
      this.filters$,
      this.storeSearch$,
    ]).pipe(
      map(
        ([freshProducts, categoryId, sortOption, filters, storeSearchIds]) => {
          const freshProductsdetails = this._filterByCategoryIdAndMapToFPQuery(
            freshProducts,
            categoryId
          )
            .filter((freshProduct) =>
              filters.priceFrom ? freshProduct.price >= filters.priceFrom : true
            )
            .filter((freshProduct) =>
              filters.priceTo ? freshProduct.price <= filters.priceTo : true
            )
            .filter((freshProduct) =>
              filters.minRatingValue
                ? freshProduct.rating.value >= filters.minRatingValue
                : true
            )
            .filter((freshProduct) =>
              storeSearchIds?.length > 0
                ? storeSearchIds?.some((id: string) =>
                    freshProduct.storeIds?.some((storeId) => storeId === id)
                  )
                : true
            )
            .filter((freshProduct) =>
              freshProduct.storeIds?.length > 0
                ? filters.storeIds?.some((id: string) =>
                    freshProduct.storeIds?.some((storeId) => storeId === id)
                  )
                : true
            );
          return this._sort(freshProductsdetails, sortOption);
        }
      ),
      shareReplay(1)
    );

  readonly freshProductsWithPagination$: Observable<
    FreshProductsDetailedQueryModel[]
  > = combineLatest([this.freshProducts$, this.pagination$]).pipe(
    map(([freshProducts, pagination]) => {
      return freshProducts.slice(
        pagination.pageNumber * pagination.pageSize - pagination.pageSize,
        pagination.pageNumber * pagination.pageSize
      );
    }),
    shareReplay(1)
  );

  readonly pageNumbers$: Observable<number[]> = combineLatest([
    this.pagination$,
    this.freshProducts$,
  ]).pipe(
    map(([pagination, freshProducts]) => {
      return freshProducts
        .slice(0, Math.ceil(freshProducts.length / pagination.pageSize))
        .map((freshProduct, i) => i + 1);
    })
  );

  readonly starFiltersData$: Observable<StarsFilterDataQueryModel[]> = of([
    { minValue: 5, stars: [1, 1, 1, 1, 1] },
    { minValue: 4, stars: [1, 1, 1, 1, 0] },
    { minValue: 3, stars: [1, 1, 1, 0, 0] },
    { minValue: 2, stars: [1, 1, 0, 0, 0] },
  ]);

  constructor(
    private _categoriesStorage: InMemoryCategoriesStorage,
    private _storesStorage: InMemoryStoresStorage,
    private _activatedRoute: ActivatedRoute,
    private _freshProductsService: FreshProductsService,
    private _router: Router
  ) {}

  onPageSizeChanged(pageSize: number): void {
    combineLatest([this.pagination$, this.freshProducts$])
      .pipe(
        tap(([pagination, freshProducts]) =>
          this._router.navigate([], {
            queryParams: {
              pageNumber: Math.min(
                Math.ceil(freshProducts.length / pageSize),
                pagination.pageNumber
              ),
              pageSize,
            },
          })
        ),
        take(1)
      )
      .subscribe();
  }

  onPageNumberChanged(pageNumber: number): void {
    this.pagination$
      .pipe(
        tap((pagination) =>
          this._router.navigate([], {
            queryParams: {
              pageNumber: pageNumber,
              pageSize: pagination.pageSize,
            },
          })
        ),
        take(1)
      )
      .subscribe();
  }

  onCheckboxChange(storeId: string) {
    let finalStoreIds: string[];
    this.filters$
      .pipe(
        take(1),
        tap((filters: FiltersFreshProductsQueryModel) => {
          const storeIndex = filters.storeIds.indexOf(storeId);
          finalStoreIds = filters.storeIds;
          filters.storeIds.some((id) => id === storeId)
            ? finalStoreIds.splice(storeIndex, 1)
            : (finalStoreIds = [...filters.storeIds, storeId]);
          this.filtersForm.setValue({ ...filters, storeIds: finalStoreIds });
        })
      )
      .subscribe();
  }

  private _findCategoryNameById(
    categoryId: string,
    categories: CategoryModel[]
  ): string {
    return (
      categories.find((category) => category.id === categoryId)?.name || ''
    );
  }

  private _filterByCategoryIdAndMapToFPQuery(
    freshProducts: FreshProductsModel[],
    categoryId: string
  ): FreshProductsDetailedQueryModel[] {
    return freshProducts.reduce((acc, c) => {
      if (c.categoryId === categoryId) {
        return [
          ...acc,
          {
            name: c.name,
            imageUrl: c.imageUrl.slice(1),
            price: c.price,
            featureValue: c.featureValue,
            storeIds: c.storeIds,
            rating: {
              value: c.ratingValue,
              starsValues: this._makeStarsValues(c.ratingValue),
              ratingCount: c.ratingCount,
            },
          },
        ];
      }
      return [...acc];
    }, [] as FreshProductsDetailedQueryModel[]);
  }

  private _makeStarsValues(value: number): number[] {
    const starsValues: number[] = [];
    for (let i = 0; i < 5; i++) {
      let valueMinusIndex = value - i;

      if (valueMinusIndex >= 1) {
        starsValues.push(1);
      } else if (valueMinusIndex > 0) {
        starsValues.push(0.5);
      } else {
        starsValues.push(0);
      }
    }

    return starsValues;
  }

  private _sort(
    freshProductsdetails: FreshProductsDetailedQueryModel[],
    sortOption: string
  ): FreshProductsDetailedQueryModel[] {
    return freshProductsdetails.sort((fpA, fpB) => {
      if (sortOption === 'featureValueDesc') {
        return fpA.featureValue > fpB.featureValue ? -1 : 1;
      }
      if (sortOption === 'priceAsc') {
        return fpA.price < fpB.price ? -1 : 1;
      }
      if (sortOption === 'priceDesc') {
        return fpA.price < fpB.price ? 1 : -1;
      }
      if (sortOption === 'ratingDesc') {
        return fpA.rating.value > fpB.rating.value ? -1 : 1;
      }
      return 0;
    });
  }
}
