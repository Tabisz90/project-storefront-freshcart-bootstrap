import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { FreshProductsModel } from '../../models/fresh-products.model';
import { FreshProductsService } from '../../services/fresh-products.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-products-by-categories',
  templateUrl: './products-by-categories.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsByCategoriesComponent {
  readonly products$: Observable<FreshProductsModel[]> =
    this._freshProductsService.getAll().pipe(shareReplay(1));

  readonly fruitsAndVegetables$: Observable<
    Omit<FreshProductsModel, 'categoryId'>[]
  > = this.products$.pipe(
    map((products) => {
      const filteredAndMapped = this._sortByCategoryAndMapToProductsQuery(
        products,
        '5'
      );
      return this._sortDescending(filteredAndMapped);
    })
  );

  readonly snacksAndMunchies$: Observable<
    Omit<FreshProductsModel, 'categoryId'>[]
  > = this.products$.pipe(
    map((products) => {
      const filteredAndMapped = this._sortByCategoryAndMapToProductsQuery(
        products,
        '2'
      );
      return this._sortDescending(filteredAndMapped);
    })
  );

  constructor(private _freshProductsService: FreshProductsService) {}

  private _sortByCategoryAndMapToProductsQuery(
    freshProducts: FreshProductsModel[],
    categoryId: string
  ): Omit<FreshProductsModel, 'categoryId'>[] {
    return freshProducts.reduce((acc, c) => {
      if (c.categoryId === categoryId && acc.length < 5) {
        return [
          ...acc,
          {
            name: c.name,
            price: c.price,
            imageUrl: c.imageUrl.slice(1),
            featureValue: c.featureValue,
          },
        ];
      }
      return [...acc];
    }, [] as Omit<FreshProductsModel, 'categoryId'>[]);
  }

  private _sortDescending(
    freshProducts: Omit<FreshProductsModel, 'categoryId'>[]
  ): Omit<FreshProductsModel, 'categoryId'>[] {
    return freshProducts.sort((productA, productB) => {
      if (productA.featureValue > productB.featureValue) {
        return -1;
      }
      if (productA.featureValue < productB.featureValue) {
        return 1;
      }
      return 0;
    });
  }
}
