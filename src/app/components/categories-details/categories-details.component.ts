import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, shareReplay, of, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryModel } from '../../models/category.model';
import { FreshProductsModel } from '../../models/fresh-products.model';
import { InMemoryCategoriesStorage } from '../../storages/categories/in-memory-categories.storage';
import { FreshProductsService } from '../../services/fresh-products.service';
import { FreshProductsDetailedQueryModel } from '../../query-models/fresh-products-detailed.query-model';
import { FormControl } from '@angular/forms';
import { SortOrderQueryModel } from '../../query-models/sort-order.query-model';

@Component({
  selector: 'app-categories-details',
  templateUrl: './categories-details.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesDetailsComponent {
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
  readonly categoryId$: Observable<string> = this._activatedRoute.params.pipe(
    map((params) => params['categoryId'])
  );
  readonly categories$: Observable<CategoryModel[]> = this._categoriesStorage
    .select()
    .pipe(shareReplay(1));
  readonly categoriesNames$: Observable<string[]> = this.categories$.pipe(
    map((categories) => categories.map((category) => category.name))
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
    ]).pipe(
      map(([freshProducts, categoryId, sortOption]) => {
        const freshProductsdetails = this._filterByCategoryIdAndMapToFPQuery(
          freshProducts,
          categoryId
        );
        return this._sort(freshProductsdetails, sortOption);
      })
    );

  constructor(
    private _categoriesStorage: InMemoryCategoriesStorage,
    private _activatedRoute: ActivatedRoute,
    private _freshProductsService: FreshProductsService
  ) {}

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
    if (sortOption === 'featureValueDesc') {
      return this._sortByFeatureValueDesc(freshProductsdetails);
    }
    if (sortOption === 'priceAsc' || sortOption === 'priceDesc') {
      return this._sortByPrice(freshProductsdetails, sortOption);
    }
    if (sortOption === 'ratingDesc') {
      return this._sortByRatingValueDesc(freshProductsdetails);
    }
    return freshProductsdetails;
  }

  private _sortByFeatureValueDesc(
    freshProductsdetails: FreshProductsDetailedQueryModel[]
  ): FreshProductsDetailedQueryModel[] {
    return freshProductsdetails.sort((fpA, fpB) => {
      if (fpA.featureValue > fpB.featureValue) {
        return -1;
      }
      if (fpA.featureValue < fpB.featureValue) {
        return 1;
      }
      return 0;
    });
  }

  private _sortByPrice(
    freshProductsdetails: FreshProductsDetailedQueryModel[],
    sortOption: string
  ): FreshProductsDetailedQueryModel[] {
    return freshProductsdetails.sort((fpA, fpB) => {
      if (fpA.price > fpB.price) {
        return sortOption === 'priceAsc' ? 1 : -1;
      }
      if (fpA.price < fpB.price) {
        return sortOption === 'priceAsc' ? -1 : 1;
      }
      return 0;
    });
  }

  private _sortByRatingValueDesc(
    freshProductsdetails: FreshProductsDetailedQueryModel[]
  ): FreshProductsDetailedQueryModel[] {
    return freshProductsdetails.sort((fpA, fpB) => {
      if (fpA.rating.value > fpB.rating.value) {
        return -1;
      }
      if (fpA.rating.value < fpB.rating.value) {
        return 1;
      }
      return 0;
    });
  }
}
