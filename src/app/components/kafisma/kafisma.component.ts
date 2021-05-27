import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import KafismaRuJson from '../../data/kafisma-ru-json';
import EndsRu from '../../data/ends-ru-json';
import EndsCs from '../../data/ends-cs-json';
import {ISettings} from '../../models/ISettings';
import {SettingsService} from '../../services/settings-service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {IEnd, IEndsList} from '../../models/IEnd';
import {IKafismaData} from '../../models/IKafismaData';


@UntilDestroy()
@Component({
  selector: 'kafisma',
  templateUrl: 'kafisma.component.html'
})
export class KafismaComponent implements OnChanges{
  @Input() kafismaNumber: number;

  public settings: ISettings = this.settingsService.getSettings();
  public strings: any[];
  public kafisma: IKafismaData;
  public kafismaEnd: IEnd;

  constructor(
    private settingsService: SettingsService
  ) {
    this.settingsService.getSettingsSubj()
      .pipe(untilDestroyed(this))
      .subscribe((settings: ISettings) => {
        this.settings = settings;
        this.ngOnChanges();
      });
  }

  ngOnChanges(): void {
    if (this.kafismaNumber) {
      this.kafisma = (new KafismaRuJson()).data[this.kafismaNumber];
    }
    this.fetchKafismaEnd();
  }

  fetchKafismaEnd() {
    let source: IEndsList;

    if (this.settings.textSource === 'ru') {
      source = (new EndsRu()).data;
    } else if (this.settings.textSource === 'cs') {
      source = (new EndsCs()).data;
    }
    this.kafismaEnd = source[this.kafismaNumber];
  }
}
