import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'app-needs',
  templateUrl: './needs.page.html',
  styleUrls: ['./needs.page.scss'],
})
export class NeedsPage {

  constructor(
    public router: Router,
    public platform: Platform
  ) {
    this.platform.backButton
      .pipe(untilDestroyed(this))
      .subscribe(()=> this.router.navigate(['/home']));
  }

  openPage(page: number): void {
    this.router.navigate(['/page/psalm'],
      {
        queryParams: {
          psalm: page,
          ru: 'Псалом ' + (+page),
          cs: 'Псалом ' + (+page),
          isFavorite: false,
          disableNavigation: true
        }
    });
  }
}
