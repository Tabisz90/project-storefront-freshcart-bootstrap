import { NgModule } from '@angular/core';
import { StoreComponent } from './store.component';
import { StoreSearchWithProductsComponentModule } from '../../store-search-with-products/store-search-with-products.component-module';

@NgModule({
  imports: [StoreSearchWithProductsComponentModule],
  declarations: [StoreComponent],
  providers: [],
  exports: [StoreComponent],
})
export class StoreComponentModule {}
