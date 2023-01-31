import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

@Injectable()
export class LocalBasketStorage {
  private _subject: Subject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {
    this._subject.next(JSON.parse(localStorage.getItem('basket') || '[]'));
  }

  set(products: string[]): Observable<void> {
    this._subject.next(products);
    localStorage.setItem('basket', JSON.stringify(products));
    return of(void 0);
  }

  select(): Observable<string[]> {
    return this._subject.asObservable();
  }
}
