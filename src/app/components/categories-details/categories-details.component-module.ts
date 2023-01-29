import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriesDetailsComponent } from './categories-details.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  declarations: [CategoriesDetailsComponent],
  providers: [],
  exports: [CategoriesDetailsComponent],
})
export class CategoriesDetailsComponentModule {}
