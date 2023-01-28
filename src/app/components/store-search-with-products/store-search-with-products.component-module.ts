import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreSearchWithProductsComponent } from './store-search-with-products.component';

@NgModule({
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  declarations: [StoreSearchWithProductsComponent],
  providers: [],
  exports: [StoreSearchWithProductsComponent],
})
export class StoreSearchWithProductsComponentModule { }
