import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryQueryModel } from '../../query-models/category.query-model';
import { InMemoryCategoriesStorage } from '../../storages/categories/in-memory-categories.storage';
import { IsVisibleQueryModel } from '../../query-models/is-visible.query-model';
import { LocalBasketStorage } from '../../storages/basket/local-basket.storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly freshProductsIds$: Observable<string[]> =
    this._basketStorage.select();
  readonly categories$: Observable<Omit<CategoryQueryModel, 'imageUrl'>[]> =
    this._categoriesStorage.select().pipe(
      map((categories) =>
        categories.map((category) => ({
          name: category.name,
          link: `categories/${category.id}`,
        }))
      )
    );
  private _isNavbarVisibleSubject: BehaviorSubject<IsVisibleQueryModel> =
    new BehaviorSubject<IsVisibleQueryModel>({ isNavbarVisible: false });
  public isNavbarVisible$: Observable<IsVisibleQueryModel> =
    this._isNavbarVisibleSubject.asObservable();

  constructor(
    private _categoriesStorage: InMemoryCategoriesStorage,
    private _basketStorage: LocalBasketStorage
  ) {}

  toggleNavbar(value: boolean) {
    this._isNavbarVisibleSubject.next({ isNavbarVisible: !value });
  }
}
