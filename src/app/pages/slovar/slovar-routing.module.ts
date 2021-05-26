import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SlovarPage} from './slovar.page';

const routes: Routes = [
  {
    path: '',
    component: SlovarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlovarPageRoutingModule {}
