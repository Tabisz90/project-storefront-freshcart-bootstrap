import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  debounceTime,
  startWith,
  combineLatest,
  filter,
  shareReplay,
} from 'rxjs';
import { FreshProductsModel } from '../../models/fresh-products.model';
import { FreshProductsService } from '../../services/fresh-products.service';
import { StoreQueryModel } from '../../query-models/store.query-model';
import { StoreProductQueryModel } from '../../query-models/store-product.query-model';
import { map } from 'rxjs/operators';
import { InMemoryStoresStorage } from '../../storages/stores/in-memory-stores.storage';

@Component({
  selector: 'app-store-search-with-products',
  templateUrl: './store-search-with-products.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreSearchWithProductsComponent {
  readonly storeId$: Observable<string> = this._activatedRoute.params.pipe(
    map((params) => params['storeId']),
    shareReplay(1)
  );
  readonly searchForm: FormControl = new FormControl();
  readonly searchText$ = this.searchForm.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    filter((text: string) => text.length > 2 || text === ''),
    map((text: string) => text.toLowerCase().trim())
  );
  readonly storeName$: Observable<Omit<StoreQueryModel, 'link'>> =
    combineLatest([this.storeId$, this._storesStorage.select()]).pipe(
      map(([storeId, stores]) => {
        const store = stores.find((store) => store.id === storeId);
        return {
          name: store?.name || '',
          logoUrl: store?.logoUrl.slice(1) || '',
          distanceInKilometers: (store?.distanceInMeters || 1) * 0.001,
        };
      })
    );
  readonly products$: Observable<StoreProductQueryModel[]> = combineLatest([
    this.searchText$,
    this._freshProductsService.getAll(),
    this.storeId$,
  ]).pipe(
    map(([text, products, storeId]) =>
      this._mapAndFilterToStoreQueryModel(text, products, storeId)
    )
  );

  constructor(
    private _freshProductsService: FreshProductsService,
    private _activatedRoute: ActivatedRoute,
    private _storesStorage: InMemoryStoresStorage
  ) {}

  private _mapAndFilterToStoreQueryModel(
    text: string,
    products: FreshProductsModel[],
    storeId: string
  ): StoreProductQueryModel[] {
    return products.reduce((acc, c) => {
      if (
        c.storeIds.includes(storeId) &&
        (c.name.toLowerCase().trim().includes(text) || text === '') &&
        acc.length < 5
      ) {
        return [...acc, { name: c.name, imageUrl: c.imageUrl.slice(1) }];
      }
      return [...acc];
    }, [] as StoreProductQueryModel[]);
  }
}
