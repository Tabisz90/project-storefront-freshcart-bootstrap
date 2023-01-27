import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryQueryModel } from '../../query-models/category.query-model';
import { map } from 'rxjs/operators';
import { InMemoryCategoriesStorage } from '../../storages/categories/in-memory-categories.storage';

@Component({
  selector: 'app-shops-by-categories',
  templateUrl: './shops-by-categories.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopsByCategoriesComponent {
  readonly categories$: Observable<CategoryQueryModel[]> =
    this._categoriesStorage.select().pipe(
      map((categories) =>
        categories.map((category) => ({
          name: category.name,
          link: `categories/${category.id}`,
          imageUrl: category.imageUrl,
        }))
      )
    );

  constructor(private _categoriesStorage: InMemoryCategoriesStorage) {}
}
