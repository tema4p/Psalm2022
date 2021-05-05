import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-needs',
  templateUrl: './needs.page.html',
  styleUrls: ['./needs.page.scss'],
})
export class NeedsPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  openPage(page: any): void {
    console.log('page', page);
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
