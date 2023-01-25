import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { StoreComponent } from './components/store/store.component';
import { HomeComponentModule } from './components/home/home.component-module';
import { CategoryComponentModule } from './components/category/category.component-module';
import { StoreComponentModule } from './components/store/store.component-module';
import { CategoriesServiceModule } from './services/categories.service-module';

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
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
