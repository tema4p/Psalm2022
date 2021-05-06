/* tslint:disable:forin */
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {Config, MenuController, Platform, ToastController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {HomePage} from './pages/home/home.page';
import {SettingsService} from './services/settings-service';
import {RateService} from './services/rate-service';
import {Contents} from '../content/contents';
import {Router} from '@angular/router';
import * as _ from 'lodash';

export interface IPageNavItem {
  item: any;
  note?: string;
  url?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [`app.component.scss`],
  providers: [SettingsService, RateService],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  // @ViewChild(Nav) nav: Nav;
  backButtonPressedOnceToExit: boolean;
  rootPage: any = HomePage;

  pages: IPageNavItem[] = [];

  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Inbox',
      url: '/folder/Inbox',
      icon: 'mail'
    },
    {
      title: 'Outbox',
      url: '/folder/Outbox',
      icon: 'paper-plane'
    },
    {
      title: 'Favorites',
      url: '/folder/Favorites',
      icon: 'heart'
    },
    {
      title: 'Archived',
      url: '/folder/Archived',
      icon: 'archive'
    },
    {
      title: 'Trash',
      url: '/folder/Trash',
      icon: 'trash'
    },
    {
      title: 'Spam',
      url: '/folder/Spam',
      icon: 'warning'
    }
  ];
  public labels = [`Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders`];

  constructor(
    public router: Router,
    public platform: Platform,
    public statusBar: StatusBar,
    public settingsService: SettingsService,
    private rateService: RateService,
    private config: Config,
    private toastCtrl: ToastController,
    private menu: MenuController
  ) {

  }

  menuOpened() {
    this.pages = [];
    console.log('menuOpened', _.cloneDeep(this.settingsService.settings));
    const other = Contents.getOtherList();
    const kafizma = Contents.getKafizmaList();

    this.pages.push({ item: other[`ustav`], url: '/page/ustav'});
    this.pages.push({ item: other[`start`], url: '/page/start'});

    for (const item in kafizma) {
      this.pages.push({
        item: kafizma[item],
        url: '/page/' + item,
        note: this.settingsService.getPsalmsRange(kafizma[item].kafisma)
      });
    }

    this.pages.push({ item: other[`end`], url: '/page/end'});
    this.pages.push({ item: other[`songs`], url: '/page/songs'});
    this.pages.push({ item: other[`posled`], url: '/page/posled'});
    this.pages.push({ item: other[`pomannik`], url: '/page/pomannik'});
    this.pages.push({ item: other[`info`], url: '/page/info'});
    this.pages.push({ item: other[`6p`], url: '/page/6p'});
    this.pages.push({ item: other[`12p`], url: '/page/12p'});
    console.log('this.pages', this.pages);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      this.config.set('backButtonText', 'Назад');

      // TODO: android back button
      // this.platform.registerBackButtonAction(() => {
      //
      //   if (this.backButtonPressedOnceToExit) {
      //     this.platform.exitApp();
      //   } else if (this.nav.canGoBack()) {
      //     this.nav.pop({});
      //   } else if (this.nav.getActive().name != 'HomePage') {
      //     this.openHome();
      //   } else {
      //     this.showToast();
      //     this.backButtonPressedOnceToExit = true;
      //     setTimeout(() => {
      //       this.backButtonPressedOnceToExit = false;
      //     },2000)
      //   }
      // });

    });
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

  openHome(): void {
    this.router.navigate(['/home']);
  }

  openSlovar(): void {
    this.router.navigate(['/slovar']);
  }

  openNeeds(): void {
    this.router.navigate(['/needs']);
  }
}
