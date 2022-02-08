import {Component, Input, OnChanges} from '@angular/core';
import AddsRu from '../../data/adds-ru';
import AddsCs from '../../data/adds-cs';
import {SettingsService} from '../../services/settings-service';
import {ISettings} from '../../models/ISettings';
import {IAddsList} from '../../models/IAdd';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'adds',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.scss'],
})
export class AddsComponent implements OnChanges {
  @Input() addsId: string;

  public data: string;
  public settings: ISettings = this.settingsService.getSettings();

  constructor(
    private settingsService: SettingsService
  ) {
    this.settingsService.getSettingsSubj()
      .pipe(untilDestroyed(this))
      .subscribe((settings) => {
        this.settings = settings;
        this.ngOnChanges();
      });
  }

  ngOnChanges() {
    let source: IAddsList;
    if (this.addsId) {
      let add: string = this.addsId;
      if (this.settings.textSource === 'ru') {
        source = (new AddsRu()).data;
      } else if (this.settings.textSource === 'cs') {
        source = (new AddsCs()).data;
      }
      if (this.addsId === 'slava') {
        if (this.settings.repose) {
          add = 'repose';
        } else if (!this.settings.adds) {
          add = 'slavaShort';
        }
      }

      if (this.addsId === 'slavaPre' && !this.settings.adds) {
        add = 'slavaPreShort';
      }

      if (this.addsId === 'trisv' && !this.settings.adds) {
        add = 'trisvShort';
      }

      if (this.addsId === 'repose' && !this.settings.adds) {
        add = 'slavaShort';
      }

      this.data = source[add].data;
    }
  }

  getFontColor() {
    if (this.settings.isCustomColors) {
      if (this.settings.themeUI === 'normal') {
        return this.settings.cColor;
      } else {
        return this.settings.cColorDark;
      }
    }
  }
}
