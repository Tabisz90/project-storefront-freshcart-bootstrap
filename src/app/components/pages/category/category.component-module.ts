import { NgModule } from '@angular/core';
import { CategoryComponent } from './category.component';
import { CategoriesDetailsComponentModule } from '../../categories-details/categories-details.component-module';

@NgModule({
  imports: [CategoriesDetailsComponentModule],
  declarations: [CategoryComponent],
  providers: [],
  exports: [CategoryComponent],
})
export class CategoryComponentModule {}
