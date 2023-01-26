import { NgModule } from '@angular/core';
import { FooterComponent } from './footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InMemoryStoresStorageModule } from '../../storages/stores/in-memory-stores.storage-module';
import { InMemoryCategoriesStorageModule } from '../../storages/categories/in-memory-categories.storage-module';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    InMemoryStoresStorageModule,
    InMemoryCategoriesStorageModule,
  ],
  declarations: [FooterComponent],
  providers: [],
  exports: [FooterComponent],
})
export class FooterComponentModule {}
