import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {Config, MenuController, Platform, ToastController} from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {SettingsService} from './services/settings-service';
import {Contents} from '../content/contents';
import {Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {each} from 'lodash';
import {PowerManagement} from '@ionic-native/power-management/ngx';
import * as moment from 'moment';
import {IHistoryItem} from './pages/home/home.page';

export interface IPageNavItem {
  item: any;
  note?: string;
  url?: string;
}

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [`app.component.scss`],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  backButtonPressedOnceToExit: boolean;

  public pages: IPageNavItem[] = [];
  public selectedIndex = 0;
  public settings = this.settingsService.getSettings();

  constructor(
    public router: Router,
    public platform: Platform,
    public statusBar: StatusBar,
    public settingsService: SettingsService,
    private config: Config,
    private toastCtrl: ToastController,
    private powerManagement: PowerManagement
  ) {
    this.settingsService.getSettingsSubj()
      .pipe(untilDestroyed(this))
      .subscribe((settings) => {
        this.settings = settings;
      });
    this.setWakeLock();
    this.openLastPlace();
  }

  async openLastPlace() {
    const item = this.settings.history[this.settings.history.length - 1];
    if (!item || !this.settings.lastPlace) {
      return;
    }
    const historyItem: IHistoryItem = {
      item: Contents.getKafismaItem(`${item.kafisma}`),
      note: moment(item.date).format('DD.MM.YY HH:mm'),
      progress: item.progress,
      page: item.page
    }
    this.router.navigate(['/page/kafisma' + historyItem.item.kafisma], {
      queryParams: {
        history: JSON.stringify(historyItem)
      }
    });
  }

  async setWakeLock() {
    try {
      await this.powerManagement.acquire();
    } catch (e) {
      console.error(e);
    }
  }

  async menuOpened() {
    this.pages = [];
    const other = Contents.getOtherList();
    const kafisma = Contents.getKafismaList();

    this.pages.push({ item: other.ustav, url: '/page/ustav'});
    this.pages.push({ item: other.start, url: '/page/start'});

    each(kafisma, (item, key) => {
      this.pages.push({
        item,
        url: '/page/' + key,
        note: this.settingsService.getPsalmsRange(item.kafisma)
      });
    });

    this.pages.push({ item: other.end, url: '/page/end'});
    this.pages.push({ item: other.songs, url: '/page/songs'});
    this.pages.push({ item: other.posled, url: '/page/posled'});
    this.pages.push({ item: other.pomannik, url: '/page/pomannik'});
    this.pages.push({ item: other.info, url: '/page/info'});
    this.pages.push({ item: other.p6, url: '/page/p6'});
    this.pages.push({ item: other.p12, url: '/page/p12'});
  }

  async initializeApp() {
    await this.platform.ready();
    this.statusBar.styleBlackOpaque();
    this.settingsService.updateStatusBar();
    this.settingsService.updateTheme();
    this.config.set('backButtonText', 'Назад');
  }

  ngOnInit() {
    this.initializeApp();
    this.menuOpened();
  }

  async showToast() {
    const toast = await this.toastCtrl.create({
      message: 'Нажмите еще раз для выхода из приложения',
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
  }

  openHome() {
    this.router.navigate(['/home']);
  }

  openSlovar() {
    this.router.navigate(['/slovar']);
  }

  openNeeds() {
    this.router.navigate(['/needs']);
  }
}
