import { NgModule } from '@angular/core';
import { ShopsByCategoriesComponent } from './shops-by-categories.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [ShopsByCategoriesComponent],
  providers: [],
  exports: [ShopsByCategoriesComponent],
})
export class ShopsByCategoriesComponentModule {}
