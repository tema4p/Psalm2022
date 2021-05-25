import { Component } from '@angular/core';
// import { SettingsPage } from '../settings/settings';
// import { Contents } from '../../content/contents';
// import { PageView } from '../../pages/page-view/page-view';
// import { SettingsService } from '../../app/services/settingsService';
import {NavController, ToastController} from '@ionic/angular';
import {Contents} from '../../../content/contents';
import {SettingsService} from '../../services/settings-service';

import * as _ from 'lodash';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';


@Component({
  selector: 'page-home',
  styleUrls: ['home.page.scss'],
  templateUrl: 'home.page.html'
})
export class HomePage {
  public settings;
  public isIntroHidden = '';
  public bookmarks: Array<{item: any; component?: any; note: string}> = [];
  public history: Array<{item: any; component?: any; note: string; page: number; progress: number}> = [];
  public psalms: Array<{item: any; component?: any; note: string; isFavorite?: boolean}> = [];

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public splashScreen: SplashScreen,
              public router: Router,
              public settingsService: SettingsService
  ) {
    this.loadBookmarks();
    this.loadPsalms();
    this.loadHistory();
    this.isIntroHidden = localStorage[`isIntroHidden`];

    this.settingsService.getSettingsSubj().subscribe((settings) => {
      console.log('getSettingsSubj', settings);
      this.settings = settings;
      this.loadBookmarks();
      this.loadPsalms();
      this.loadHistory();
    });
  }

  ionViewDidEnter(): void {
    this.splashScreen.hide();

    console.log('ionViewDidEnter');
    this.loadBookmarks();
    this.loadPsalms();
    this.loadHistory();
    if (this.settingsService.settings.lastPlace && !(window as any).justOpened && this.history[0]) {
      (window as any).justOpened = true;
      this.openHistoryPage(this.history[0]);
    }
  }

  loadBookmarks(): void {
    const kafizma = Contents.getKafizmaList();
    this.bookmarks = [];
    this.settings = this.settingsService.getSettings();
    _.each(this.settings.bookmarks, (item) => {
      this.bookmarks.push({
        item: kafizma['kafisma' + item],
        // component: PageView, TODO: fix
        note: this.settingsService.getPsalmsRange(item)
      });
    });
    console.log('loadBookmarks', this.bookmarks);
  }

  loadHistory(): void {
    const kafizma = Contents.getKafizmaList();
    this.history = [];
    this.settings = this.settingsService.getSettings();
    console.log('this.settings.history', this.settings.history);
    _.each(this.settings.history.slice(-7).reverse(), (item) => {
      console.log('item', item);
      this.history.push({
        item: kafizma['kafisma' + item.kafisma],
        // component: PageView,
        note: moment(item.date).format('DD.MM.YY HH:mm'),
        progress: item.progress,
        page: item.page
      });
    });
    console.log('loadHistory', this.history);
  }

  loadPsalms(): void {
    this.psalms = [];
    this.settings = this.settingsService.getSettings();
    console.log('this.settings', this.settings);
    _.each(this.settings.psalms, (item) => {
      this.psalms.push({
        item: {
          psalm: item,
          ru: 'Псалом ' + (+item),
          cs: 'Псалом ' + (+item)
        },
        isFavorite: true,
        // component: PageView,
        note: ''
      });
      this.psalms = _.sortBy(this.psalms, (itemPs: any) => +itemPs.item.psalm);
    });
    console.log('loadPsalms', this.psalms);
  }

  openHistoryPage(history: any): void {
    this.router.navigate(['/page/kafisma' + history.item.kafisma], {
      queryParams: {
        history: JSON.stringify(history)
      }
    });
  }

  openPsalm(page: any): void {
    console.log('page', page);
    page.item.isFavorite = true;

    this.router.navigate(['/page/psalm/' + page.item.psalm], {
      queryParams: page.item
    });
  }

  async removeBookmark(page) {
    this.settings.bookmarks = _.without(this.settings.bookmarks, +page.item.kafisma);
    this.settingsService.saveSettings(this.settings);
    const toast = await this.toastCtrl.create({
      message: `Кафизма ${ +page.item.kafisma } убрана из закладок.`,
      duration: 3000
    });
    toast.present();
    this.loadBookmarks();
  }

  async removePsalm(page) {
    console.log('page', page);
    this.settings.psalms = _.without(this.settings.psalms, page.item.psalm);
    this.settingsService.saveSettings(this.settings);
    const toast = await this.toastCtrl.create({
      message: `Псалом ${+page.item.psalm} убран из избранного.`,
      duration: 3000
    });
    toast.present();
    this.loadPsalms();
  }

  goSettings(): void {
    this.router.navigate(['/settings']);
  }

  ionViewWillEnter() {
    console.log('enter');
    this.settings = this.settingsService.getSettings();
  }

  hideIntro(): void {
    this.isIntroHidden = 'true';
    localStorage[`isIntroHidden`] = this.isIntroHidden;
  }

  showIntro(): void {
    this.isIntroHidden = 'false';
    localStorage[`isIntroHidden`] = this.isIntroHidden;
  }
}
