
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as $ from 'jquery';

import addsCs from 'src/app/data/adds-cs';
import addsRu from 'src/app/data/adds-ru';
import chinCs from '../../data/chin-cs';
import chinRu from 'src/app/data/chin-ru';
import songsCs from '../../data/songs-cs';
import songsRu from 'src/app/data/songs-ru';
import psalmRuJson from 'src/app/data/psalm-ru-json';
import {NavController, NavParams, Platform, PopoverController, ToastController} from '@ionic/angular';
import {SettingsService} from '../../services/settings-service';
import kafismaRuJson from 'src/app/data/kafisma-ru-json';
import {PsalmPopoverComponent} from '../../components/psalm-popover/psalm-popover.component';
import {Contents} from '../../../content/contents';
import {ActivatedRoute, Route, Router} from '@angular/router';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.page.html',
  styleUrls: ['./page-view.page.scss'],
})
export class PageViewPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('afterPage', {static: false}) afterPage: ElementRef | any;
  @ViewChild('ionContent', {static: false}) ionContent: ElementRef | any;

  public content = '';
  public title = '';
  public titleForceRu = false;
  public settings: any = {};
  public page = 0;
  public pagesTotal = 0;
  public isLandscape = (window as any).screen.orientation.type.indexOf('landscape') > -1;
  public enableInfo = true;
  public hideInfoTimeOut: any;
  public container: any;
  public kafisma: string;
  public kafismaJson: any;

  public contentId: string;

  public prevPsalm: string;
  public nextPsalm: string;

  public psalmJson: any;
  public scrollTimeout: any;
  public forceTitleRu = false;

  public data: any = {
    adds: {
      cs: (new addsCs()).data,
      ru: (new addsRu()).data,
    },
    chin: {
      cs: (new chinCs()).data,
      ru: (new chinRu()).data,
    },
    songs: {
      cs: (new songsCs()).data,
      ru: (new songsRu()).data,
    }
  };

  public dataJson: any = {
    psalm: {
      ru: (new psalmRuJson()).data
    }
  };

  private rotationHandler: any;
  public navParams: any;
  public disableNavigation: boolean;

  constructor(
    public navCtrl: NavController,
    private router: Router,
    private settingsService: SettingsService,
    private toastCtrl: ToastController,
    private viewElement: ElementRef,
    private chRef: ChangeDetectorRef,
    public popoverCtrl: PopoverController,
    private route: ActivatedRoute,
    public platform: Platform
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.initContent();
    this.kafisma = this.kafisma || this.navParams.data.item.kafisma;
    this.kafismaJson = (new kafismaRuJson()).data[this.kafisma];
    console.log('this.navParams.data', this.navParams.data);
    if (this.navParams.data.page || this.page > 0) {
      this.page = this.navParams.data.page;
    } else {
      this.page = 0;
    }

    setTimeout(() => {
      this.calculatePagesTotal();
      this.chRef.detectChanges();
      this.resetScrollPosition();
    }, 400);
  }

  ionViewDidEnter() {
    this.registerNativeButtons();
  }

  resetScrollPosition() {
    console.log('+= load progress', this.navParams.data.progress);
    if (!this.settings.bookMode) {
      console.log('this.viewElement', this.viewElement);
      const $s = $(this.ionContent.el);
      console.log('$s', $s);
      const curHeight: number = $(this.ionContent.el)[0].scrollHeight;
      this.scrollTo(curHeight * this.navParams.data.progress);
    } else if (this.navParams.data.progress > 0 && this.navParams.data.page === 0) {
      this.goPage(+(this.pagesTotal * this.navParams.data.progress));
    }
  }

  ionScrollEnd(e) {
    console.log('e', e);
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      console.log('scrollTop', $(e.target) );
      this.addHistory(e.target.scrollTop, $(e.target)[0].scrollHeight);
    }, 1000);
  }


  registerNativeButtons() {
    console.log('this.ionContent', this.ionContent);
    const $el = $(this.ionContent.el);
    document.addEventListener('volumeupbutton', () => {
      console.log('volumeupbutton');
      if (this.settings.bookMode) {
        this.goPage(this.page - 1);
      } else {
        const step: number = $el.height() - 40;
        const scroll: number = $el[0].scrollTop;
        this.scrollTo(scroll - step);
      }
    }, false);
    document.addEventListener('volumedownbutton', () => {
      console.log('volumedownbutton');

      if (this.settings.bookMode) {
        this.goPage(this.page + 1);
      } else {
        const step: number = $el.height() - 40;
        const scroll: number = $el[0].scrollTop;
        this.scrollTo(scroll + step);
      }
    }, false);
  }

  initContent() {
    const newSettings = this.settingsService.getSettings();

    if (this.content === '' ||
      this.settings.textSource !== newSettings.textSource ||
      this.settings.adds !== newSettings.adds ||
      this.settings.repose !== newSettings.repose) {
      this.settings = newSettings;
      this.loadContent();
    } else {
      this.settings = newSettings;
    }

    if (!this.settings.bookMode) {
      this.page = 0;
      this.chRef.detectChanges();
      return;
    }
  }

  ngOnInit() {
    (screen as any).orientation.unlock();
    console.log('this.route', this.route);

    this.route.queryParams.subscribe(params => {
      console.log('params', params); // {order: "popular"}
      this.disableNavigation = params.disableNavigation || false;
      this.navParams = {
        data: {
          item: params
        }
      };
    });

    this.route.params.subscribe(params => {
      console.log('params', params);
      const other = Contents.getOtherList();
      const kafizma = Contents.getKafizmaList();
      const item = kafizma[params.id] || other[params.id];

      if (item) {
        this.navParams = {
          data: {item}
        };
        this.contentId = params.id;
      }
    });
    this.settings = this.settingsService.getSettings();

    setTimeout(() => {
      this.container = $(this.viewElement.nativeElement).find('#contentContainer')[0];

    });

    this.initRotationHandler();
    // console.log('ngOnInit');
    this.goKafisma(this.navParams.data.item.kafisma);
  }

  ngAfterViewInit() {
    this.initPopOver();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    window.removeEventListener('orientationchange', this.rotationHandler);
    (screen as any).orientation.removeEventListener('change', this.rotationHandler);

    if (this.hideInfoTimeOut) {
      clearTimeout(this.hideInfoTimeOut);
    }
  }

  async initPopOver() {
    console.log($(this.viewElement.nativeElement));
    $(this.viewElement.nativeElement).on('click touch', '[psalm]', async (e: any) => {
      e._element = this.viewElement.nativeElement;
      const popover = await this.popoverCtrl.create({
        component: PsalmPopoverComponent,
        componentProps: {
          elem: this.viewElement.nativeElement,
          event: e,
          backdropDismiss: true
        },
        // elem: this.viewElement.nativeElement,
        event: e,
        // toastCtrl: this.toastCtrl,
        // settingsService: this.settingsService,
      });

      return await popover.present();
    });
  }

  initRotationHandler() {
    this.rotationHandler = (() => {
      // console.log('view orientationchange');
      const progress: number  = this.page / this.pagesTotal;
      // console.log('this.page', this.page);
      // console.log('this.pagesTotal', this.pagesTotal);
      // console.log('progress', progress);
      this.isLandscape = (window as any).screen.orientation.type.indexOf('landscape') > -1;
      setTimeout(() => {
        this.calculatePagesTotal();
        this.goPage(Math.round(this.pagesTotal * progress));
        this.chRef.detectChanges();
      }, 400);
    });
    window.addEventListener('orientationchange', this.rotationHandler, false);
    (screen as any).orientation.addEventListener('change', this.rotationHandler);
  }

  loadContent() {
    if (this.navParams.data.item.add) {
      this.content = this.data.adds[this.settings.textSource][this.navParams.data.item.add].data;
    } else if (this.navParams.data.item.psalm) {
      // this.content = this.getPsalm(this.navParams.data.item.psalm);
      this.psalmJson = this.dataJson.psalm.ru[this.navParams.data.item.psalm];
      console.log('this.navParams.data', this.navParams.data);
      console.log('this.psalmJson', this.psalmJson);
      if (this.navParams.data.item.isFavorite) {
        console.log('isFavorite');
        console.log('this.settings', this.settings.psalms);
        this.settings.psalms = _.sortBy(this.settings.psalms, (item) => +item);
        const index: number = this.settings.psalms.indexOf(this.navParams.data.item.psalm);
        console.log('this.settings.psalms', this.settings.psalms);
        console.log('index', index);
        this.prevPsalm = (index > 0) ? this.settings.psalms[index - 1] : undefined;
        this.nextPsalm = this.settings.psalms[index + 1] || undefined;
      } else {
        // const prev: number = +this.navParams.data.item.psalm - 1;
        // const next: number = +this.navParams.data.item.psalm + 1;
        // this.prevPsalm = `${prev > 0 ? prev : null}`;
        // this.nextPsalm = `${next < 151 ? next : null}`;
      }
    } else if (this.navParams.data.item.chin) {
      this.content = this.data.chin[this.settings.textSource][this.navParams.data.item.chin].data;
    } else if (this.navParams.data.item.songs) {
      this.content = this.data.songs[this.settings.textSource];
    }

    this.updateTitle();
    this.checkExtends();

    if (this.page > 0) {
      this.goPage(this.page);
    }
  }

  goPsalm(psalm: string) {
    this.router.navigate(['/page/psalm/' + psalm],
      {
        queryParams: {
          psalm,
          ru: 'Псалом ' + (+psalm),
          cs: 'Псалом ' + (+psalm),
          isFavorite: this.navParams.data.item.isFavorite
        },
        replaceUrl: true
      });
  }

  checkExtends() {
    if (this.settings.textSource !== 'ru') {
      return;
    }
    const el = $('<div></div>').html(this.content);
    this.content = el.html();
    setTimeout(() => {
      if (this && this.chRef) {
        this.calculatePagesTotal();
        this.chRef.detectChanges();
      }
    });
  }

  goSettings(): void {
    // this.navCtrl.push(SettingsPage);
  }

  async setBookMark() {
    if (!this.isMarked()) {
      this.settings.bookmarks.push(+this.kafisma);
      this.settings.bookmarks = _.sortBy(this.settings.bookmarks);
      this.settingsService.saveSettings(this.settings);
      const toast = await this.toastCtrl.create({
        message: `Кафизма ${+this.kafisma} добавленна в закладки`,
        duration: 3000
      });
      toast.present();
    } else {
      this.settings.bookmarks = _.without(this.settings.bookmarks, +this.kafisma);
      this.settingsService.saveSettings(this.settings);
      const toast = await this.toastCtrl.create({
        message: `Кафизма ${+this.kafisma} убрана из закладок.`,
        duration: 3000
      });
      toast.present();
    }
  }

  addHistory(scrollPosition?: number, scrollHeight?: number): void {
    console.log('addHistory', scrollPosition, scrollHeight);
    if (!this.kafisma) {
      return;
    }
    let progress: number;

    if (this.settings.bookMode) {
      progress = this.page / this.pagesTotal;
    } else {
      progress = scrollPosition / scrollHeight;
    }

    const last = this.settings.history[this.settings.history.length - 1];

    if (!last || (+this.kafisma && +last.kafisma !== +this.kafisma)) {
      this.settings.history.push({
        kafisma: +this.kafisma,
        date: moment().toISOString(),
        progress,
        page: this.page
      });
      if (this.settings.history.length > 20) {
        this.settings.history = this.settings.history.slice(-20, 0);
      }
      console.log('this.settings.history', this.settings.history);
      this.settingsService.saveSettings(this.settings);
    } else if (+last.kafisma === +this.kafisma) {
      last.date = moment().toISOString();
      last.progress = progress;
      last.page = this.page;
      this.settingsService.saveSettings(this.settings);
    }
    console.log('save progress', progress);
  }

  isMarked(): boolean {
    return this.settings.bookmarks.indexOf(+this.kafisma) !== -1;
  }

  public getTranslateX(): string {
    const vw: number = 100 * this.page;
    return `-${vw}vw`;
  }

  public goPage(n): void {
    console.log('goPage', n);
    if (!this.settings.bookMode) {
      this.page = 0;
      this.chRef.detectChanges();
      return;
    }

    if (n > -1 && n <= this.pagesTotal - 1) {
      this.page = n;
    }
    // console.log('goPage', n, ' / ', this.pagesTotal);
    this.calculatePagesTotal();
    setTimeout(() => {
      this.calculatePagesTotal();
      this.chRef.detectChanges();
    }, 1000);

    this.showInfo();
    this.addHistory();
  }

  public showInfo(): void {
    this.enableInfo = true;
    if (this.hideInfoTimeOut) {
      clearTimeout(this.hideInfoTimeOut);
    }
    this.hideInfoTimeOut = setTimeout(() => {
      this.enableInfo = false;
      this.chRef.detectChanges();
    }, 3000);
  }

  public calculatePagesTotal(): number {
    if (!this.container) {
      return 1;
    }

    if (!this.settings.bookMode) {
      this.page = 0;
      return;
    }
    this.page = this.page || 0;
    // let pages = this.container.scrollWidth / window.screen.availWidth;
    let pages: number;
    const $afterPage: any = this.afterPage.el;
    if (this.isLandscape) {
      pages = (+$afterPage.offsetLeft - 10) / (+$afterPage.offsetWidth + 10) / 2;
    } else {
      pages = (+$afterPage.offsetLeft - 10) / (+$afterPage.offsetWidth + 10);
    }

    console.log('pages', pages);
    this.pagesTotal = Math.ceil(pages);

    console.log('this.page', this.page);
    if (this.page > (this.pagesTotal - 1)) {
      this.page = this.pagesTotal - 1;
    }
    return this.pagesTotal;
  }

  public goKafisma(id: string): void {
    console.log('goKafisma', id);
    this.kafisma = id;
    this.kafismaJson = (new kafismaRuJson()).data[this.kafisma];
    this.page = 0;
    this.loadContent();
    setTimeout(() => this.scrollTo(0));
  }

  public scrollTo(top: number): void {
    const $el = $(this.ionContent.el).find('.inner-scroll');
    console.log('$el', $el);
    this.ionContent.scrollToPoint(0, top, 200);
  }

  updateTitle() {
    if (this.kafisma) {
      const item = Contents.getItem(this.kafisma);
      this.title = item[this.settings.textSource];
    } else if (this.navParams.data.item.psalm) {
      this.title = this.navParams.data.item[this.settings.textSource];
      this.forceTitleRu = true;
    } else {
      this.title = this.navParams.data.item[this.settings.textSource];
      this.forceTitleRu = this.navParams.data.item.forceRu;
    }
  }


  goToPsalm(psalm): void {
    const $target: any = $(`[psalmid="${psalm}"]`)[0];
    console.log('$target', $target);
    if (!this.settings.bookMode) {
      this.scrollTo($target.offsetTop - 15);
      console.log('page', $target.offsetTop);
    } else {
      const page = Math.floor($target.offsetLeft / ($target.offsetWidth + 10));

      this.goPage(page);
    }
  }
}
