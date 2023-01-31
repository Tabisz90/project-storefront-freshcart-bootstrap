import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { FreshProductsModel } from '../../models/fresh-products.model';
import { FreshProductsService } from '../../services/fresh-products.service';
import { LocalBasketStorage } from '../../storages/basket/local-basket.storage';
import { map } from 'rxjs/operators';
import { FreshProductsDetailedQueryModel } from '../../query-models/fresh-products-detailed.query-model';

@Component({
  selector: 'app-products-in-basket',
  templateUrl: './products-in-basket.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsInBasketComponent {
  readonly freshProducts$: Observable<FreshProductsDetailedQueryModel[]> =
    combineLatest([
      this._freshProductsService.getAll(),
      this._basketStorage.select(),
    ]).pipe(
      map(([products, ids]) =>
        this._filterByProductIdAndMapToFPQuery(products, ids)
      )
    );

  constructor(
    private _freshProductsService: FreshProductsService,
    private _basketStorage: LocalBasketStorage
  ) {}

  private _filterByProductIdAndMapToFPQuery(
    freshProducts: FreshProductsModel[],
    productIds: string[]
  ): FreshProductsDetailedQueryModel[] {
    const productsMap: Record<string, FreshProductsModel> =
      freshProducts.reduce((acc, c) => {
        return { ...acc, [c.id]: c };
      }, {});

    return productIds.map((id) => {
      const product = productsMap[id];
      return {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl.slice(1),
        price: product.price,
        featureValue: product.featureValue,
        storeIds: product.storeIds,
        rating: {
          value: product.ratingValue,
          starsValues: this._makeStarsValues(product.ratingValue),
          ratingCount: product.ratingCount,
        },
      };
    });
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
