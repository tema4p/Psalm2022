import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageViewPage} from './page-view.page';
import {SharedModule} from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PageViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, SharedModule],
})
export class PageViewPageRoutingModule {}
