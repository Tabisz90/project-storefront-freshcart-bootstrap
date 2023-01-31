import { NgModule } from '@angular/core';
import { ProductsInBasketComponent } from './products-in-basket.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [ProductsInBasketComponent],
  providers: [],
  exports: [ProductsInBasketComponent],
})
export class ProductsInBasketComponentModule {}
