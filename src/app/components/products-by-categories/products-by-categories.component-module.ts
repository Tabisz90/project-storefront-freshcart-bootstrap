import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsByCategoriesComponent } from './products-by-categories.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ProductsByCategoriesComponent],
  providers: [],
  exports: [ProductsByCategoriesComponent],
})
export class ProductsByCategoriesComponentModule {}
