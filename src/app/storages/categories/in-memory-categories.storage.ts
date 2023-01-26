import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { CategoryModel } from '../../models/category.model';

@Injectable()
export class InMemoryCategoriesStorage {
  private _subject: Subject<CategoryModel[]> = new ReplaySubject(1);

  set(categories: CategoryModel[]): Observable<void> {
    this._subject.next(categories);
    return of(void 0);
  }

  select(): Observable<CategoryModel[]> {
    return this._subject.asObservable();
  }
}
