import {Component} from '@angular/core';
import {NavParams} from '@ionic/angular';
import {SettingsService} from '../../services/settings-service';

@Component({
  selector: 'app-sinod',
  templateUrl: './sinod.page.html',
  styleUrls: ['./sinod.page.scss'],
})
export class SinodPage {
  public content = '';
  public title = '';
  public settings = this.settingsService.getSettings();
  public psalmSn: string[] = (window as any).psalmSn;

  constructor(
    public settingsService: SettingsService,
    public navParams: NavParams
  ) {
    this.content = this.psalmSn[navParams.data.psalm];
  }
}
