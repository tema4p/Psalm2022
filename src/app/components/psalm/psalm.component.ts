import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import psalmRuJson from '../../data/psalm-ru-json';
import psalmCsJson from '../../data/psalm-cs-json';
import psalmSnJson from '../../data/psalm-sn-json';
import * as _ from 'lodash';
import {SettingsService} from '../../services/settings-service';
import {ISettings} from '../../../models/ISettings';

@Component({
  selector: 'psalm',
  templateUrl: 'psalm.component.html',
  styleUrls: ['./psalm.component.scss'],
})

export class PsalmComponent implements OnChanges {
  @Input() psalmNumber: number;
  @Input() psalmPart: number;
  @Input() settings: ISettings;

  strings: any[];
  strings2: any[];
  psalm: any;
  psalm2: any;

  constructor(private settingsService: SettingsService) {
    this.settingsService.getSettingsSubj().subscribe((settings: ISettings) => {
      this.settings = settings;
      this.renderText();
    });
  }

  private renderText() {
    if (!this.settings) {
      return;
    }
    let source;
    let source2;

    if (this.settings.textSource === 'ru') {
      source = (new psalmRuJson()).data;
    } else if (this.settings.textSource === 'cs') {
      source = (new psalmCsJson()).data;
    }

    if (this.settings.textSource2 === 'ru') {
      source2 = (new psalmRuJson()).data;
    } else if (this.settings.textSource2 === 'sn') {
      source2 = (new psalmSnJson()).data;
    }

    this.psalm = source[this.psalmNumber];
    this.strings = this.psalm.strings;

    if (this.psalmNumber === 118) {
      this.strings = _.filter(this.psalm.strings, {p: this.psalmPart});
    }

    if (source2) {
      this.psalm2 = source2[this.psalmNumber];
      this.strings2 = this.psalm2.strings;

      if (this.psalmNumber === 118) {
        this.strings2 = _.filter(this.psalm2.strings, {p: this.psalmPart});
      }

      _.each(this.strings, (item: any, index: number) => {
        if (!this.strings2[index]) {
          return;
        }
        item.v2 = this.strings2[index].v;
        item.n2 = this.strings2[index].n;
      });

    } else {
      _.each(this.strings, (item: any) => {
        item.v2 = item.n2 = undefined;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
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
}
