import {Component} from '@angular/core';
import {NavParams, Platform} from '@ionic/angular';
import {SettingsService} from '../../services/settings-service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Router} from '@angular/router';

@UntilDestroy()
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
    public router: Router,
    public platform: Platform,
    public navParams: NavParams
  ) {
    this.content = this.psalmSn[navParams.data.psalm];
    this.platform.backButton
      .pipe(untilDestroyed(this))
      .subscribe(()=> this.router.navigate(['/home']));
  }
}
