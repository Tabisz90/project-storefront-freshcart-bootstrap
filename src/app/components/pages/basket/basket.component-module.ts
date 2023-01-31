import { NgModule } from '@angular/core';
import { BasketComponent } from './basket.component';
import { ProductsInBasketComponentModule } from '../../products-in-basket/products-in-basket.component-module';

@NgModule({
  imports: [ProductsInBasketComponentModule],
  declarations: [BasketComponent],
  providers: [],
  exports: [BasketComponent],
})
export class BasketComponentModule {}
