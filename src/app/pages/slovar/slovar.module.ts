import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlovarPageRoutingModule } from './slovar-routing.module';

import { SlovarPage } from './slovar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SlovarPageRoutingModule
  ],
  declarations: [SlovarPage]
})
export class SlovarPageModule {}
