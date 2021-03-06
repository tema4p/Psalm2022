import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SinodPage} from './sinod.page';

const routes: Routes = [
  {
    path: '',
    component: SinodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinodPageRoutingModule {}
