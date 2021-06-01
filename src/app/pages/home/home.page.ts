import {Component} from '@angular/core';
import {Platform, ToastController} from '@ionic/angular';
import {Contents} from '../../../content/contents';
import {SettingsService} from '../../services/settings-service';

import * as moment from 'moment';
import {Router} from '@angular/router';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {each, sortBy, without} from 'lodash';
import {IKafismaItem} from '../../models/IKafismaItem';
import {Subscription} from 'rxjs';

export interface IBookMark {
  item: IKafismaItem;
  note: string;
}

export interface IHistoryItem {
  item: IKafismaItem;
  note: string;
  page: number;
  progress: number;
}

export interface IFavoritePsalm {
  item: any;
  note: string;
  isFavorite?: boolean;
}

@UntilDestroy()
@Component({
  selector: 'app-page-home',
  styleUrls: ['home.page.scss'],
  templateUrl: 'home.page.html'
})
export class HomePage {
  public settings = this.settingsService.getSettings();
  public isIntroHidden = '';
  public backButtonSubscription: Subscription;
  public bookmarks: IBookMark[] = [];
  public history: IHistoryItem[] = [];
  public favoritePsalms: IFavoritePsalm[] = [];

  constructor(
    public toastCtrl: ToastController,
    public splashScreen: SplashScreen,
    public router: Router,
    public platform: Platform,
    public settingsService: SettingsService
  ) {
    this.loadBookmarks();
    this.loadPsalms();
    this.loadHistory();
    this.isIntroHidden = localStorage.isIntroHidden;

    this.settingsService.getSettingsSubj()
      .pipe(untilDestroyed(this))
      .subscribe((settings) => {
        this.settings = settings;
        this.loadBookmarks();
        this.loadPsalms();
        this.loadHistory();
      });
  }

  ionViewDidEnter() {
    this.splashScreen.hide();
    this.loadBookmarks();
    this.loadPsalms();
    this.loadHistory();

    this.backButtonSubscription = this.platform.backButton
      .pipe(untilDestroyed(this))
      .subscribe(()=>{
        navigator['app'].exitApp();
      });
  }

  ionViewWillLeave(){
    this.backButtonSubscription.unsubscribe();
  }

  loadBookmarks() {
    this.bookmarks = [];
    each(this.settings.bookmarks, (item) => {
      this.bookmarks.push({
        item: Contents.getKafismaItem(`${item}`),
        note: this.settingsService.getPsalmsRange(`${item}`)
      });
    });
    console.log('loadBookmarks', this.bookmarks);
  }

  loadHistory() {
    this.history = [];
    each(this.settings.history.slice(-7).reverse(), (item) => {
      this.history.push({
        item: Contents.getKafismaItem(`${item.kafisma}`),
        note: moment(item.date).format('DD.MM.YY HH:mm'),
        progress: item.progress,
        page: item.page
      });
    });
    console.log('loadHistory', this.history);
  }

  loadPsalms() {
    this.favoritePsalms = [];
    each(this.settings.psalms, (item) => {
      this.favoritePsalms.push({
        item: {
          psalm: item,
          ru: 'Псалом ' + (+item),
          cs: 'Псалом ' + (+item)
        },
        isFavorite: true,
        note: ''
      });
      this.favoritePsalms = sortBy(this.favoritePsalms, (itemPs: any) => +itemPs.item.psalm);
    });
    console.log('loadPsalms', this.favoritePsalms);
  }

  openHistoryPage(history: IHistoryItem | IBookMark) {
    this.router.navigate(['/page/kafisma' + history.item.kafisma], {
      queryParams: {
        history: JSON.stringify(history)
      }
    });
  }

  openPsalm(page: IFavoritePsalm) {
    page.item.isFavorite = true;

    this.router.navigate(['/page/psalm/' + page.item.psalm], {
      queryParams: page.item
    });
  }

  async removeBookmark(page: IBookMark) {
    this.settings.bookmarks = without(this.settings.bookmarks, +page.item.kafisma);
    this.settingsService.saveSettings(this.settings);
    const toast = await this.toastCtrl.create({
      message: `Кафизма ${ +page.item.kafisma } убрана из закладок.`,
      duration: 3000
    });
    toast.present();
    this.loadBookmarks();
  }

  async removePsalm(page) {
    this.settings.psalms = without(this.settings.psalms, page.item.psalm);
    this.settingsService.saveSettings(this.settings);
    const toast = await this.toastCtrl.create({
      message: `Псалом ${+page.item.psalm} убран из избранного.`,
      duration: 3000
    });
    toast.present();
    this.loadPsalms();
  }

  hideIntro() {
    this.isIntroHidden = 'true';
    localStorage.isIntroHidden = this.isIntroHidden;
  }

  showIntro() {
    this.isIntroHidden = 'false';
    localStorage.isIntroHidden = this.isIntroHidden;
  }
}
