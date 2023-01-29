import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryModel } from '../../models/category.model';
import { FreshProductsModel } from '../../models/fresh-products.model';
import { InMemoryCategoriesStorage } from '../../storages/categories/in-memory-categories.storage';
import { FreshProductsService } from '../../services/fresh-products.service';
import { FreshProductsDetailedQueryModel } from '../../query-models/fresh-products-detailed.query-model';

@Component({
  selector: 'app-categories-details',
  templateUrl: './categories-details.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesDetailsComponent {
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
    combineLatest([this._freshProductsService.getAll(), this.categoryId$]).pipe(
      map(([freshProducts, categoryId]) =>
        this._filterByCategoryIdAndMapToFPQuery(freshProducts, categoryId)
      )
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
}
