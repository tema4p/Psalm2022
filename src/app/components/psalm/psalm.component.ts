import {Component, Input, OnChanges} from '@angular/core';
import PsalmRuJson from '../../data/psalm-ru-json';
import PsalmCsJson from '../../data/psalm-cs-json';
import PsalmSnJson from '../../data/psalm-sn-json';
import {SettingsService} from '../../services/settings-service';
import {ISettings} from '../../models/ISettings';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {IPsalm, IPsalmsList, IPsalmString} from '../../models/IPsalm';
import {each, filter} from 'lodash';


@UntilDestroy()
@Component({
  selector: 'psalm',
  templateUrl: 'psalm.component.html',
  styleUrls: ['./psalm.component.scss'],
})
export class PsalmComponent implements OnChanges {
  @Input() psalmNumber: number;
  @Input() psalmPart: number;

  public settings: ISettings = this.settingsService.getSettings();
  public strings: IPsalmString[];
  public strings2: IPsalmString[];
  public psalm: IPsalm;
  public psalm2: IPsalm;

  constructor(
    private settingsService: SettingsService
  ) {
    this.settingsService.getSettingsSubj()
      .pipe(untilDestroyed(this))
      .subscribe((settings: ISettings) => {
        this.settings = settings;
        this.renderText();
      });
  }

  ngOnChanges() {
    this.renderText();
  }

  getFontColor() {
    if (this.settings.isCustomColor) {
      if (this.settings.theme === 'normal') {
        return this.settings.customColor;
      } else {
        return this.settings.customColorDark;
      }
    }
  }

  getFontSecondColor() {
    if (this.settings.isCustomColor) {
      if (this.settings.theme === 'normal') {
        return this.settings.customColorSecond;
      } else {
        return this.settings.customColorDarkSecond;
      }
    }
  }

  private renderText() {
    if (!this.settings) {
      return;
    }
    let source: IPsalmsList;

    if (this.settings.textSource === 'ru') {
      source = (new PsalmRuJson()).data;
    } else if (this.settings.textSource === 'cs') {
      source = (new PsalmCsJson()).data;
    }

    this.psalm = source[this.psalmNumber];
    this.strings = this.psalm.strings;

    if (this.psalmNumber === 118) {
      this.strings = filter(this.psalm.strings, {p: this.psalmPart});
    }

    each(this.strings, (item: IPsalmString) => {
      item.v2 = item.n2 = undefined;
    });

    if (['ru', 'sn'].indexOf(this.settings.textSource2) > -1 ) {
      this.addTranslation();
    }
  }

  addTranslation() {
    let source2: IPsalmsList
    if (this.settings.textSource2 === 'ru') {
      source2 = (new PsalmRuJson()).data;
    } else if (this.settings.textSource2 === 'sn') {
      source2 = (new PsalmSnJson()).data;
    }
    this.psalm2 = source2[this.psalmNumber];
    this.strings2 = this.psalm2.strings;
    if (this.psalmNumber === 118) {
      this.strings2 = filter(this.psalm2.strings, {p: this.psalmPart});
    }

    each(this.strings, (item: IPsalmString, index: number) => {
      if (!this.strings2[index]) {
        return;
      }
      item.v2 = this.strings2[index].v;
      item.n2 = this.strings2[index].n;
    });
  }
}
