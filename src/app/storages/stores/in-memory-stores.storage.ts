import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { StoreModel } from '../../models/store.model';

@Injectable()
export class InMemoryStoresStorage {
  private _subject: Subject<StoreModel[]> = new ReplaySubject(1);

  set(stores: StoreModel[]): Observable<void> {
    this._subject.next(stores);
    return of(void 0);
  }

  select(): Observable<StoreModel[]> {
    return this._subject.asObservable();
  }
}
