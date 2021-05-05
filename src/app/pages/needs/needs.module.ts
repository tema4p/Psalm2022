import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NeedsPageRoutingModule } from './needs-routing.module';

import { NeedsPage } from './needs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NeedsPageRoutingModule
  ],
  declarations: [NeedsPage]
})
export class NeedsPageModule {}
