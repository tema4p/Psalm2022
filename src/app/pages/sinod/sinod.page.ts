import { Component, OnInit } from '@angular/core';
import {NavController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-sinod',
  templateUrl: './sinod.page.html',
  styleUrls: ['./sinod.page.scss'],
})
export class SinodPage implements OnInit {

  public content = '';
  public title = '';
  public settings: any = {};

  public psalmSn: string[] = (window as any).psalmSn;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.settings = navParams.data.settings;
    this.content = this.psalmSn[navParams.data.psalm];
    console.log('navParams', navParams);
  }

  ngOnInit() {
  }

}
