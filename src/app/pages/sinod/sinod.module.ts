import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SinodPageRoutingModule } from './sinod-routing.module';

import { SinodPage } from './sinod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SinodPageRoutingModule
  ],
  declarations: [SinodPage]
})
export class SinodPageModule {}
