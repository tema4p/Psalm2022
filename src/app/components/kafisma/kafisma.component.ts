import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import kafismaRuJson from '../../data/kafisma-ru-json';
import endsRu from '../../data/ends-ru-json';
import endsCs from '../../data/ends-cs-json';
import {ISettings} from '../../models/ISettings';
import {SettingsService} from '../../services/settings-service';

@Component({
  selector: 'kafisma',
  templateUrl: 'kafisma.component.html'
})

export class KafismaComponent implements OnChanges{
  @Input() kafismaNumber: number;
  public settings: ISettings = this.settingsService.getSettings();


  strings: any[];
  kafisma: any;
  kafismaEnd: any;

  constructor(
    private settingsService: SettingsService
  ) {
    this.settingsService.getSettingsSubj().subscribe((settings: ISettings) => {
      this.settings = settings;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.kafismaNumber) {
      this.kafisma = (new kafismaRuJson()).data[this.kafismaNumber];
    }
    this.fetchKafismaEnd();

  }

  fetchKafismaEnd(): void {
    let source: any;

    if (this.settings.textSource === 'ru') {
      source = (new endsRu()).data;
    } else if (this.settings.textSource === 'cs') {
      source = (new endsCs()).data;
    }
    this.kafismaEnd = source[this.kafismaNumber];
  }
}
