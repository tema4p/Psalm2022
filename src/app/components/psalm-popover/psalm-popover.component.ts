import {Component} from '@angular/core';
import * as $ from 'jquery';
import {SettingsService} from '../../services/settings-service';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {sortBy, without} from 'lodash';


@Component({
  templateUrl: 'psalm-popover.component.html'
})
export class PsalmPopoverComponent {
  public psalmId = '';
  public title = '';
  public settings = this.settingsService.getSettings();

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public settingsService: SettingsService
  ) {
    this.psalmId = $(this.navParams.data.event.currentTarget).attr('psalmid');
    this.title = 'Псалом ' + this.psalmId;
  }

  close() {
    $('ion-backdrop').click();
  }

  isMarked(): boolean {
    return this.settings.psalms.indexOf(this.psalmId) !== -1;
  }

  async setPsalmFavorite() {
    if (!this.isMarked()) {
      this.settings.psalms.push(this.psalmId);
      this.settings.psalms = sortBy(this.settings.psalms);
      this.settingsService.saveSettings(this.settings);
      const toast = await this.toastCtrl.create({
        message: `Псалом ${+this.psalmId} добавлен в избранное`,
        duration: 3000
      });
      toast.present();
    } else {
      this.settings.psalms = without(this.settings.psalms, this.psalmId);
      this.settingsService.saveSettings(this.settings);
      const toast = await this.toastCtrl.create({
        message: `Псалом ${+this.psalmId} удален из избранного`,
        duration: 3000
      });
      toast.present();
    }
    this.close();
  }
}
