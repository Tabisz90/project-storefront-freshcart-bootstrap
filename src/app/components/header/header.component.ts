import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { CategoryQueryModel } from '../../query-models/category.query-model';
import { InMemoryCategoriesStorage } from '../../storages/categories/in-memory-categories.storage';
import { CategoriesService } from '../../services/categories.service';
import { IsVisibleQueryModel } from '../../query-models/is-visible.query-model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  readonly categories$: Observable<CategoryQueryModel[]> =
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
    private _categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this._categoriesService
      .getAll()
      .pipe(
        switchMap((categories) => this._categoriesStorage.set(categories)),
        take(1)
      )
      .subscribe();
  }

  toggleNavbar(value: boolean) {
    this._isNavbarVisibleSubject.next({ isNavbarVisible: !value });
  }
}
