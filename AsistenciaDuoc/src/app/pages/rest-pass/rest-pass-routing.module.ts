import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestPassPage } from './rest-pass.page';

const routes: Routes = [
  {
    path: '',
    component: RestPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestPassPageRoutingModule {}
