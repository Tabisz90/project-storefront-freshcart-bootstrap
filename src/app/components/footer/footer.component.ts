import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { StoresService } from '../../services/stores.service';
import { CategoryQueryModel } from '../../query-models/category.query-model';
import { StoreQueryModel } from '../../query-models/store.query-model';
import { InMemoryCategoriesStorage } from '../../storages/categories/in-memory-categories.storage';
import { InMemoryStoresStorage } from '../../storages/stores/in-memory-stores.storage';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  readonly categories$: Observable<Omit<CategoryQueryModel, 'imageUrl'>[]> =
    this._categoriesStorage.select().pipe(
      map((categories) =>
        categories.map((category) => ({
          name: category.name,
          link: `categories/${category.id}`,
        }))
      )
    );

  readonly stores$: Observable<StoreQueryModel[]> = this._storesStorage
    .select()
    .pipe(
      map((stores) =>
        stores.map((store) => ({
          name: store.name,
          link: `stores/${store.id}`,
        }))
      )
    );

  readonly aboutUs$: Observable<string[]> = of([
    'Company',
    'About',
    'Blog',
    'Help Center',
    'Our Value',
  ]);

  constructor(
    private _categoriesStorage: InMemoryCategoriesStorage,
    private _storesStorage: InMemoryStoresStorage,
    private _categoriesService: CategoriesService,
    private _storesService: StoresService
  ) {}

  ngOnInit() {
    this._categoriesService
      .getAll()
      .pipe(
        switchMap((categories) => this._categoriesStorage.set(categories)),
        take(1)
      )
      .subscribe();

    this._storesService
      .getAll()
      .pipe(
        switchMap((stores) => this._storesStorage.set(stores)),
        take(1)
      )
      .subscribe();
  }
}
