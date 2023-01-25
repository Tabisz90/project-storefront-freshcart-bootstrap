import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, map, shareReplay, of } from 'rxjs';
import { CategoryQueryModel } from '../../query-models/category.query-model';
import { CategoriesService } from '../../services/categories.service';
import { StoresService } from '../../services/stores.service';
import { StoreQueryModel } from '../../query-models/store.query-model';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly categories$: Observable<CategoryQueryModel[]> =
    this._categoriesService.getAll().pipe(
      map((categories) =>
        categories.map((category) => ({
          name: category.name,
          link: `categories/${category.id}`,
        }))
      ),
      shareReplay(1)
    );
  readonly stores$: Observable<StoreQueryModel[]> = this._storesService
    .getAll()
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
    private _categoriesService: CategoriesService,
    private _storesService: StoresService
  ) {}
}
