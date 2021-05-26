import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings-service';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public settings: any;

  public fontsRange: number[] = [];
  public lineHeightRange: number[] = [];
  public fonts: string[] = ['Times', 'Arial', 'Verdana', 'Times New Roman', 'Helvetica'];

  constructor(
    public settingsService: SettingsService,
    public platform: Platform
  ) {
    for (let i = 15; i <= 50; i++ ) {
      this.fontsRange.push(i);
    }

    for (let i = 100; i <= 200; i += 20 ) {
      this.lineHeightRange.push(i);
    }

    this.settings = settingsService.getSettings();
  }

  ionViewWillLeave() {
    console.log('SettingsPage Will Leave');
    if (this.settings.textSource === 'cs') {
      this.settings.repose = false;
    }
    this.settingsService.saveSettings(this.settings);
  }

  colorChanged(color: string) {
    this.settings.customColor = color;
  }

  ngOnInit() {
  }

}
