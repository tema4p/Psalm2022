import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NeedsPage } from './needs.page';

const routes: Routes = [
  {
    path: '',
    component: NeedsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NeedsPageRoutingModule {}
