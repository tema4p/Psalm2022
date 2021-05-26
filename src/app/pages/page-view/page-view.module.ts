import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PageViewPageRoutingModule} from './page-view-routing.module';

import {PageViewPage} from './page-view.page';
import {PsalmPopoverComponent} from '../../components/psalm-popover/psalm-popover.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PageViewPageRoutingModule
  ],
  declarations: [PageViewPage],
  entryComponents: [
    PsalmPopoverComponent
  ]
})
export class PageViewPageModule {}
