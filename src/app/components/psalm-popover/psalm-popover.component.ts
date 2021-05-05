import {Component} from '@angular/core';

import * as _ from 'lodash';
import * as $ from 'jquery';
import {SettingsService} from '../../services/settings-service';
// import {SinodPage} from '../../pages/sinod/sinod';
import {ModalController, NavController, NavParams, ToastController} from '@ionic/angular';
import {ViewController} from '@ionic/core';

@Component({
  templateUrl: 'psalm-popover.component.html'
})

export class PsalmPopoverComponent {
  public psalmId = '';

  public title = '';
  public settings: any;

  constructor(public modalCtrl: ModalController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public settingsService: SettingsService
  ) {
    this.settings = this.settingsService.getSettings();
    console.log('this.modalCtrl', this.modalCtrl);
    console.log('this.navParams', this.navParams);
    this.psalmId = $(this.navParams.data.event.currentTarget).attr('psalmid');
    this.title = 'Псалом ' + this.psalmId;
  }

  close() {
    // this.modalCtrl.dismiss(null, undefined, null);
    $('ion-backdrop').click();
  }

  isMarked(): boolean {
    return this.settings.psalms.indexOf(this.psalmId) !== -1;
  }

  async setPsalmFavorite() {
    if (!this.isMarked()) {
      this.settings.psalms.push(this.psalmId);
      this.settings.psalms = _.sortBy(this.settings.psalms);
      this.settingsService.saveSettings(this.settings);

      const toast = await this.toastCtrl.create({
        message: `Псалом ${+this.psalmId} добавлен в избранное`,
        duration: 3000
      });
      toast.present();
    } else {
      this.settings.psalms = _.without(this.settings.psalms, this.psalmId);
      this.settingsService.saveSettings(this.settings);

      const toast = await this.toastCtrl.create({
        message: `Псалом ${+this.psalmId} удален из избранного`,
        duration: 3000
      });
      toast.present();
    }
    // this.modalCtrl.dismiss();
    $('ion-backdrop').click();
  }

  goPsalmSn() {
    alert('nav');
    // this.navCtrl.push(SinodPage, {psalm: +this.psalmId, settings: this.settings});
  }

  paralSn() {
    console.log('paralSn');
  }
}
