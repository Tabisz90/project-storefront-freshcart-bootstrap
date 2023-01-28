import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { InMemoryStoresStorage } from '../../storages/stores/in-memory-stores.storage';
import { Observable } from 'rxjs';
import { StoreQueryModel } from '../../query-models/store.query-model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresComponent {
  readonly stores$: Observable<StoreQueryModel[]> = this._storesStorage
    .select()
    .pipe(
      map((stores) =>
        stores.map((store) => ({
          name: store.name,
          link: `stores/${store.id}`,
          logoUrl: store.logoUrl.slice(1),
          distanceInKilometers: store.distanceInMeters * 0.001,
        }))
      )
    );

  constructor(private _storesStorage: InMemoryStoresStorage) {}
}
