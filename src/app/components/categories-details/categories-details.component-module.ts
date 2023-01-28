import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriesDetailsComponent } from './categories-details.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [CategoriesDetailsComponent],
  providers: [],
  exports: [CategoriesDetailsComponent]
})
export class CategoriesDetailsComponentModule {
}
