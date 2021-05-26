import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SinodPageRoutingModule} from './sinod-routing.module';

import {SinodPage} from './sinod.page';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SinodPageRoutingModule,
    SharedModule
  ],
  declarations: [SinodPage]
})
export class SinodPageModule {}
