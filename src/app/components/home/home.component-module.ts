import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { ShopsByCategoriesComponentModule } from '../shops-by-categories/shops-by-categories.component-module';

@NgModule({
  imports: [ShopsByCategoriesComponentModule],
  declarations: [HomeComponent],
  providers: [],
  exports: [HomeComponent],
})
export class HomeComponentModule {}
