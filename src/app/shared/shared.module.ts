import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsService} from '../services/settings-service';
import {AddsComponent} from '../components/adds/adds.component';
import {EndsComponent} from '../components/ends/ends.component';
import {KafismaComponent} from '../components/kafisma/kafisma.component';
import {PsalmComponent} from '../components/psalm/psalm.component';
import {PsalmPopoverComponent} from '../components/psalm-popover/psalm-popover.component';
import {SafeHtmlPipe} from '../pipes/safe-html.pipe';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [
    AddsComponent,
    EndsComponent,
    KafismaComponent,
    PsalmComponent,
    PsalmPopoverComponent,
    SafeHtmlPipe
  ],
  imports: [
    IonicModule.forRoot(),
    CommonModule
  ],
  exports: [
    AddsComponent,
    EndsComponent,
    KafismaComponent,
    PsalmComponent,
    PsalmPopoverComponent,
    SafeHtmlPipe
  ],
  providers: [

  ],
  entryComponents: [
    AddsComponent,
    EndsComponent,
    KafismaComponent,
    PsalmComponent,
    PsalmPopoverComponent,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        SettingsService
      ]
    };
  }
}
