import {Component} from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-needs',
  templateUrl: './needs.page.html',
  styleUrls: ['./needs.page.scss'],
})
export class NeedsPage {

  constructor(
    public router: Router
  ) { }

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
