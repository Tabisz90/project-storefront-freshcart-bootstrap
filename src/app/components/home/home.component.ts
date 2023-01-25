import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { map, Observable } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { CategoryQueryModel } from '../../query-models/category.query-model';

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
      )
    );

  constructor(private _categoriesService: CategoriesService) {}
}
