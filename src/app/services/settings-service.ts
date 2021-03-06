import {Injectable} from '@angular/core';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Platform} from '@ionic/angular';
import * as $ from 'jquery';
import {Observable, Subject} from 'rxjs';
import {ISettings} from '../models/ISettings';
import {IObjectMap} from '../models/IObjectMap';
import {clone, extend} from 'lodash';
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const NavigationBar;

const psalmsRange: IObjectMap<string> = {
  1:  '1-8',
  2:  '9-16',
  3:  '17-23',
  4:  '24-31',
  5:  '32-36',
  6:  '37-45',
  7:  '46-54',
  8:  '55-63',
  9:  '64-69',
  10: '70-76',
  11: '77-84',
  12: '85-90',
  13: '91-100',
  14: '101-104',
  15: '105-108',
  16: '109-117',
  17: '118',
  18: '119-133',
  19: '134-142',
  20: '143-150',
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private $settings = new Subject<ISettings>();
  private settings: ISettings = {
    fontSize: '18',
    fontFamily: 'Times New Roman',
    textSource: 'ru',
    textSource2: '0',
    translateOrientation: 'horizontal',
    lineHeight: 120,
    themeUI: 'normal',
    isCustomColors: false,
    cColor: '#2f2f2f',
    cColorSecond: '#17172f',
    cColorBg: '#FFFDF0',
    cColorDark: '#FFFDF0',
    cColorDarkSecond: '#fcf6ff',
    cColorDarkBg: '#000000',
    perenos: false,
    extraSpace: false,
    hyphens: true,
    justify: true,
    repose: false,
    adds: true,
    fullscreen: false,
    lastPlace: true,
    bookMode: true,
    bookmarks: [],
    history: [],
    psalms: []
  };

  constructor(
    public statusBar: StatusBar,
    public platform: Platform
  ) {
    this.loadSettings();
    // this.updateTheme();
    // this.updateStatusBar();
  }

  public getSettingsSubj(): Observable<ISettings> {
    return this.$settings;
  }

  public saveSettings(settings: ISettings) {
    console.log('saveSettings', settings);
    setTimeout(() => {
      extend(this.settings, settings);
      this.$settings.next(this.settings);
      console.log('SaveSettings', this.settings);
      this.fixAndroidCsJustify();
      localStorage.settings = JSON.stringify(this.settings);
      this.updateTheme();
      // this.updateStatusBar();
    }, 50)
  }

  public loadSettings() {
    if (localStorage.settings) {
      extend(this.settings, JSON.parse(localStorage.settings));
      console.log('LoadSettings', this.settings);
    } else {
      console.log('Default Settings', this.settings);
    }
    console.log('this', this);
    this.$settings.next(this.settings);
  }

  public getSettings(): ISettings {
    this.fixAndroidCsJustify();
    if (this.settings.textSource === 'cs') {
      this.settings.repose = false;
    }
    return clone(this.settings);
  }

  public getPsalmsRange(kafisma: string): string {
    return psalmsRange[kafisma];
  }

  public updateTheme() {
    $('body')
      .toggleClass('dark', this.settings.themeUI === 'dark')
      .toggleClass('normal', this.settings.themeUI === 'normal');
    if (this.settings.themeUI === 'dark') {
      this.statusBar.styleLightContent();
    } else {
      this.statusBar.styleDefault();
    }
  }

  public updateStatusBar() {
    console.log('this.statusBar', this.statusBar);
    if (typeof NavigationBar === 'undefined') {
      return;
    }
    if (this.settings.fullscreen) {
      this.statusBar.hide();
      NavigationBar.hide();
    } else {
      this.statusBar.show();
      NavigationBar.show();
    }
  }

  public fixAndroidCsJustify() {
    if (this.platform.is('android')
      && (this.settings.textSource === 'cs' || this.settings.textSource2 === 'cs')
    ) {
      this.settings.justify = false;
    }
  }
}
