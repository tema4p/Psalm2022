import {Component, Input, OnChanges} from '@angular/core';
import EndsRu from '../../data/ends-ru-json';
import EndsCs from '../../data/ends-cs-json';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {ISettings} from '../../models/ISettings';
import {SettingsService} from '../../services/settings-service';
import {IEndsList} from '../../models/IEnd';


@UntilDestroy()
@Component({
  selector: 'ends',
  templateUrl: 'ends.component.html'
})
export class EndsComponent implements OnChanges {
  @Input() endId: string;

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
   let source: IEndsList;

   if (this.endId) {
      if (this.settings.textSource === 'ru') {
        source = (new EndsRu()).data;
      } else if (this.settings.textSource === 'cs') {
        source = (new EndsCs()).data;
      }
      this.data = source[this.endId].data;
    }
  }
}
