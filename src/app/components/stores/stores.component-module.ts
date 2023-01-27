import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoresComponent } from './stores.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [StoresComponent],
  providers: [],
  exports: [StoresComponent]
})
export class StoresComponentModule {
}
