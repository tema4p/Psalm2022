import {Injectable} from '@angular/core';
import {StatusBar} from '@ionic-native/status-bar';
import {Platform} from '@ionic/angular';
import {AndroidFullScreen} from '@ionic-native/android-full-screen/ngx';
import * as _ from 'lodash';
import * as $ from 'jquery';
import {Observable, Subject} from 'rxjs';
import {ISettings} from '../../models/ISettings';

const psalmsRange = {
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

  public settings: ISettings = {
    fontSize: '18',
    fontFamily: 'Times New Roman',
    textSource: 'ru',
    textSource2: '0',
    translateOrientation: 'horizontal',
    lineHeight: 120,
    theme: 'normal',
    isCustomColor: false,
    customColor: '#FFFDF0',
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
    // public statusBar: StatusBar,
    private androidFullScreen: AndroidFullScreen,
    public platform: Platform
  ) {

    this.loadSettings();
    console.log('SettingsService init');
    this.updateTheme();
    this.updateStatusBar();
  }

  public getSettingsSubj(): Observable<ISettings> {
    return this.$settings;
  }

  saveSettings(settings: any): any {
    _.extend(this.settings, settings);
    this.$settings.next(this.settings);

    this.fixAndroidCsJustify();

    localStorage[`settings`] = JSON.stringify(this.settings);
    console.log('SaveSettings', this.settings);
    this.updateTheme();
    this.updateStatusBar();
  }

  loadSettings(): any {
    if (localStorage[`settings`]) {
      _.extend(this.settings, JSON.parse(localStorage[`settings`]));
      console.log('LoadSettings', this.settings);
    } else {
      console.log('Default Settings', this.settings);
    }
    console.log('this', this);
    this.$settings.next(this.settings);
  }

  getSettings(): any {
    this.loadSettings();
    this.fixAndroidCsJustify();
    if (this.settings.textSource === 'cs') {
      this.settings.repose = false;
    }
    return _.clone(this.settings);
  }

  getPsalmsRange(kafizma: string): any {
    return psalmsRange[kafizma];
  }

  updateTheme(): void {
    $('body')
      .toggleClass('dark', this.settings.theme === 'dark')
      .toggleClass('normal', this.settings.theme === 'normal');
  }

  updateStatusBar(): void {
    if (this.settings.fullscreen) {
      this.androidFullScreen.isImmersiveModeSupported()
        .then(() => this.androidFullScreen.immersiveMode())
        .catch((error: any) => console.log(error));
    } else {
      this.androidFullScreen.isImmersiveModeSupported()
        .then(() => this.androidFullScreen.showSystemUI())
        .catch((error: any) => console.log(error));
    }
  }

  fixAndroidCsJustify() {
    if (this.platform.is('android')
      && (this.settings.textSource === 'cs' || this.settings.textSource2 === 'cs')) {
      this.settings.justify = false;
    }
  }
}
