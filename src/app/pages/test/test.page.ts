import {Component, OnInit} from '@angular/core';
import PsalmRuJson from '../../data/psalm-ru-json';
import PsalmCsJson from 'src/app/data/psalm-cs-json';
import PsalmSnJson from 'src/app/data/psalm-sn-json';
import {each, map} from 'lodash';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  public psalmCsJson = new PsalmCsJson().data;
  public psalmRuJson = new PsalmRuJson().data;
  public psalmSnJson = new PsalmSnJson().data;
  public psalms = [];

  constructor(
    public router: Router,
    public platform: Platform
  ) {
    this.platform.backButton
      .pipe(untilDestroyed(this))
      .subscribe(()=> this.router.navigate(['/home']));
  }

  ngOnInit() {
    each(this.psalmCsJson, (psalm, i) => {
      this.psalms[i] = {
        cs: psalm,
        ru: this.psalmRuJson[i],
        sn: this.psalmSnJson[i],
      };
      this.checkStrings(this.psalms[i]);
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
