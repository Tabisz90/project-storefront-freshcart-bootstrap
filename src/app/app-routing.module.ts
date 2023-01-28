import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './components/pages/category/category.component';
import { StoreComponent } from './components/pages/store/store.component';
import { HomeComponentModule } from './components/pages/home/home.component-module';
import { CategoryComponentModule } from './components/pages/category/category.component-module';
import { StoreComponentModule } from './components/pages/store/store.component-module';
import { CategoriesServiceModule } from './services/categories.service-module';
import { StoresServiceModule } from './services/stores.service-module';
import { InMemoryCategoriesStorageModule } from './storages/categories/in-memory-categories.storage-module';
import { InMemoryStoresStorageModule } from './storages/stores/in-memory-stores.storage-module';
import { FreshProductsServiceModule } from './services/fresh-products.service-module';
import { HomeComponent } from './components/home/home.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'categories/:categoryId',
    component: CategoryComponent,
  },
  {
    path: 'stores/:storeId',
    component: StoreComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeComponentModule,
    CategoryComponentModule,
    StoreComponentModule,
    CategoriesServiceModule,
    StoresServiceModule,
    FreshProductsServiceModule,
    InMemoryCategoriesStorageModule,
    InMemoryStoresStorageModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
