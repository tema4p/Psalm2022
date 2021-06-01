import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import * as moment from 'moment';
import * as $ from 'jquery';

import AddsCs from 'src/app/data/adds-cs';
import AddsRu from 'src/app/data/adds-ru';
import ChinCs from '../../data/chin-cs';
import ChinRu from 'src/app/data/chin-ru';
import SongsCs from '../../data/songs-cs';
import SongsRu from 'src/app/data/songs-ru';
import PsalmRuJson from 'src/app/data/psalm-ru-json';
import {Platform, PopoverController, ToastController} from '@ionic/angular';
import {SettingsService} from '../../services/settings-service';
import KafismaRuJson from 'src/app/data/kafisma-ru-json';
import {PsalmPopoverComponent} from '../../components/psalm-popover/psalm-popover.component';
import {Contents} from '../../../content/contents';
import {ActivatedRoute, Router} from '@angular/router';
import {ISettings} from '../../models/ISettings';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {IKafismaData} from '../../models/IKafismaData';
import {IPsalmsList} from '../../models/IPsalm';
import {IObjectMap} from '../../models/IObjectMap';
import {sortBy, without} from 'lodash';
import {IPageViewNavParams} from '../../models/IPageViewNavParams';


@UntilDestroy()
@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.page.html',
  styleUrls: ['./page-view.page.scss'],
})
export class PageViewPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('afterPage', {static: false}) afterPage: ElementRef | any;
  @ViewChild('ionContent', {static: false}) ionContent: ElementRef | any;
  @ViewChild('ionHeader', {static: false}) ionHeader: ElementRef | any;
  @ViewChild('scrollEnd', {static: false}) scrollEnd: ElementRef | any;
  @ViewChild('contentContainer', {static: false}) contentContainer: ElementRef | any;

  public content = '';
  public title = '';
  public settings: ISettings = this.settingsService.getSettings();
  public page = 0;
  public pagesTotal = 0;
  public enableInfo = true;
  public hideInfoTimeOut: number | any;
  public container: JQuery<HTMLElement> | any;
  public kafisma: string;
  public kafismaJson: IKafismaData;
  public contentId: string;
  public prevPsalm: string;
  public nextPsalm: string;
  public psalmJson: IPsalmsList;
  public scrollTimeout: number | any;
  public forceTitleRu = false;
  public scrollBoxStyle: IObjectMap<string>;

  public data = {
    adds: {
      cs: (new AddsCs()).data,
      ru: (new AddsRu()).data,
    },
    chin: {
      cs: (new ChinCs()).data,
      ru: (new ChinRu()).data,
    },
    songs: {
      cs: (new SongsCs()).data,
      ru: (new SongsRu()).data,
    }
  };

  public dataJson = {
    psalm: {
      ru: (new PsalmRuJson()).data
    }
  };

  private rotationHandler: () => void;
  public navParams: {
    data: IPageViewNavParams
  };
  public disableNavigation: boolean;

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private toastCtrl: ToastController,
    private viewElement: ElementRef,
    private chRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    public popoverCtrl: PopoverController,
    public platform: Platform
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.settingsService.getSettingsSubj()
      .pipe(untilDestroyed(this))
      .subscribe((settings: ISettings) => {
        this.settings = settings;
      });
    this.platform.backButton
      .pipe(untilDestroyed(this))
      .subscribe(()=> this.router.navigate(['/home']));
  }

  ionViewWillEnter() {
    this.initContent();
    this.kafisma = this.kafisma || this.navParams.data.item.kafisma;
    this.kafismaJson = (new KafismaRuJson()).data[this.kafisma];
    console.log('this.navParams.data', this.navParams.data);
    if (this.navParams.data.page || this.page > 0) {
      this.page = this.navParams.data.page;
    } else {
      this.page = 0;
    }

    setTimeout(() => {
      this.calculatePagesTotal();
      this.chRef.detectChanges();
    }, 400);
  }

  ionViewDidEnter() {
    this.registerNativeButtons();
  }

  public isLandscape() {
    if ((window as any).screen.orientation) {
      return (window as any).screen.orientation.type.indexOf('landscape') > -1;
    } else {
      return 1;
    }
  };

  resetScrollPosition(progress: number) {
    if (!this.settings.bookMode) {
      const height = $(this.contentContainer.nativeElement)[0].clientHeight;
      this.scrollTo(height * progress);
    } else {
      this.goPage(+(Math.floor(this.pagesTotal * progress)));
    }
  }

  ionScroll(e) {
    const height = $(this.contentContainer.nativeElement)[0].clientHeight;
    const position = e.detail.scrollTop;
    const ionContentHeight = $(this.ionContent.el).height();
    const scrollBoxHeight = (ionContentHeight  / height) * ionContentHeight;
    const percent = (position ) / (height - ionContentHeight);
    const value = (1 - percent) * (ionContentHeight - scrollBoxHeight);
    this.scrollBoxStyle = {
      bottom: `${value}px`,
      height: `${scrollBoxHeight}px`
    };
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.addHistory(position, height);
    }, 1000);
  }


  registerNativeButtons() {
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
      this.settings.repose !== newSettings.repose
    ) {
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
    if ((screen as any).orientation) {
      (screen as any).orientation.unlock();
    }

    this.route.queryParams.subscribe(params => {
      this.disableNavigation = params.disableNavigation || false;

      if (params.history) {
        const history = JSON.parse(params.history);
        this.navParams = {
          data: {
            item: history.item
          }
        };
        setTimeout(() => {
          this.resetScrollPosition(history.progress);
        }, 1000);
      } else {
        this.navParams = {
          data: {
            item: params
          }
        };
      }
    });

    this.route.params.subscribe(params => {
      console.log('params', params);
      const other = Contents.getOtherList();
      const kafisma = Contents.getKafismaList();
      const item = kafisma[params.id] || other[params.id];

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
    if (this.navParams.data.item.kafisma) {
      this.goKafisma(+this.navParams.data.item.kafisma);
    }
  }

  ngAfterViewInit() {
    this.initPopOver();
  }

  ngOnDestroy() {
    window.removeEventListener('orientationchange', this.rotationHandler);

    if ((screen as any).orientation) {
      (screen as any).orientation.removeEventListener('change', this.rotationHandler);
    }

    if (this.hideInfoTimeOut) {
      clearTimeout(this.hideInfoTimeOut);
    }
  }

  async initPopOver() {
    $(this.viewElement.nativeElement).on('click touch', '[psalm]', async (e: any) => {
      e._element = this.viewElement.nativeElement;
      const popover = await this.popoverCtrl.create({
        component: PsalmPopoverComponent,
        componentProps: {
          elem: this.viewElement.nativeElement,
          event: e,
          backdropDismiss: true
        },
        event: e
      });

      return await popover.present();
    });
  }

  initRotationHandler() {
    this.rotationHandler = (() => {
      const progress: number  = this.page / this.pagesTotal;
      setTimeout(() => {
        this.calculatePagesTotal();
        this.goPage(Math.round(this.pagesTotal * progress));
        this.chRef.detectChanges();
      }, 400);
    });
    window.addEventListener('orientationchange', this.rotationHandler, false);
    if ((screen as any).orientation) {
      (screen as any).orientation.addEventListener('change', this.rotationHandler);
    }
  }

  loadContent() {
    if (this.navParams.data.item.add) {
      this.content = this.data.adds[this.settings.textSource][this.navParams.data.item.add].data;
    } else if (this.navParams.data.item.psalm) {
      this.psalmJson = this.dataJson.psalm.ru[this.navParams.data.item.psalm];
      if (this.navParams.data.item.isFavorite) {
        this.settings.psalms = sortBy(this.settings.psalms, (item) => +item);
        const index: number = this.settings.psalms.indexOf(this.navParams.data.item.psalm);
        this.prevPsalm = (index > 0) ? this.settings.psalms[index - 1] : undefined;
        this.nextPsalm = this.settings.psalms[index + 1] || undefined;
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

  async setBookMark() {
    if (!this.isMarked()) {
      this.settings.bookmarks.push(+this.kafisma);
      this.settings.bookmarks = sortBy(this.settings.bookmarks);
      this.settingsService.saveSettings(this.settings);
      const toast = await this.toastCtrl.create({
        message: `Кафизма ${+this.kafisma} добавленна в закладки`,
        duration: 3000
      });
      toast.present();
    } else {
      this.settings.bookmarks = without(this.settings.bookmarks, +this.kafisma);
      this.settingsService.saveSettings(this.settings);
      const toast = await this.toastCtrl.create({
        message: `Кафизма ${+this.kafisma} убрана из закладок.`,
        duration: 3000
      });
      toast.present();
    }
  }

  addHistory(scrollPosition?: number, scrollHeight?: number): void {
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
      this.settingsService.saveSettings(this.settings);
    } else if (+last.kafisma === +this.kafisma) {
      last.date = moment().toISOString();
      last.progress = progress;
      last.page = this.page;
      this.settingsService.saveSettings(this.settings);
    }
  }

  isMarked(): boolean {
    return this.settings.bookmarks.indexOf(+this.kafisma) !== -1;
  }

  public getTranslateX(): string {
    const vw: number = 100 * this.page;
    return `-${vw}%`;
  }

  public goPage(n): void {
    if (!this.settings.bookMode) {
      this.page = 0;
      this.chRef.detectChanges();
      return;
    }

    if (n > -1 && n <= this.pagesTotal - 1) {
      this.page = n;
    }
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
    const menuOffset = document.documentElement.scrollWidth - $(this.ionContent.el).width();

    let pages: number;
    const $afterPage: any = this.afterPage.el;

    if (this.isLandscape() && menuOffset === 0) {
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

  public goKafisma(id: number): void {
    this.kafisma = `${id}`;
    this.kafismaJson = (new KafismaRuJson()).data[this.kafisma];
    this.page = 0;
    this.loadContent();
    setTimeout(() => this.scrollTo(0));
  }

  public scrollTo(top: number): void {
    // const $el = $(this.ionContent.el).find('.inner-scroll');
    // console.log('$el', $el);
    this.ionContent.scrollToPoint(0, top, 200);
  }

  updateTitle() {
    if (this.kafisma) {
      const item = Contents.getKafismaItem(this.kafisma);
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
    const $target = $(`[psalmid="${psalm}"]`)[0];

    if (!this.settings.bookMode) {
      this.scrollTo($target.offsetTop - 15);
    } else {
      const page = Math.floor($target.offsetLeft / ($target.offsetWidth + 10));
      this.goPage(page);
    }
  }

  getBgColor() {
    if (this.settings.isCustomColor) {
      if (this.settings.theme === 'normal') {
        return this.settings.customColorBg;
      } else {
        return this.settings.customColorDarkBg;
      }
    }
  }
}
