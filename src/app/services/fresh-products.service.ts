import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FreshProductsModel } from '../models/fresh-products.model';

@Injectable()
export class FreshProductsService {
  constructor(private _httpClient: HttpClient) {}

  getAll(): Observable<FreshProductsModel[]> {
    return this._httpClient.get<FreshProductsModel[]>(
      `https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-products`
    );
  }
}
