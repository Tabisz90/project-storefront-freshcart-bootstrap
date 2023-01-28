import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { InMemoryCategoriesStorage } from '../../storages/categories/in-memory-categories.storage';
import { CategoryModel } from '../../models/category.model';

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

  constructor(
    private _categoriesStorage: InMemoryCategoriesStorage,
    private _activatedRoute: ActivatedRoute
  ) {}

  private _findCategoryNameById(
    categoryId: string,
    categories: CategoryModel[]
  ): string {
    return (
      categories.find((category) => category.id === categoryId)?.name || ''
    );
  }
}
