import { Component, OnInit } from '@angular/core';
import psalmRuJson from '../../data/psalm-ru-json';
import psalmCsJson from 'src/app/data/psalm-cs-json';
import psalmSnJson from 'src/app/data/psalm-sn-json';
import {each, map} from 'lodash';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  public psalmCsJson = new psalmCsJson().data;
  public psalmRuJson = new psalmRuJson().data;
  public psalmSnJson = new psalmSnJson().data;
  public psalms = [];

  constructor() { }

  ngOnInit() {
    each(this.psalmCsJson, (psalm, number) => {
      this.psalms[number] = {
        cs: psalm,
        ru: this.psalmRuJson[number],
        sn: this.psalmSnJson[number],
      }
      this.checkStrings(this.psalms[number]);
    });
  }

  checkStrings(psalm) {
    const cs = map(psalm.cs.strings, (psalmString) => psalmString.n).join(',');
    const ru = map(psalm.ru.strings, (psalmString) => psalmString.n).join(',');
    const sn = map(psalm.sn.strings, (psalmString) => psalmString.n).join(',');

    if (cs !== ru || ru !== sn || cs !== sn) {
      console.log('Strings error: ', psalm);
    }

  }

}
