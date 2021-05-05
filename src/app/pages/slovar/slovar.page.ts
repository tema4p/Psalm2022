import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import slovar from '../../data/slovar';

@Component({
  selector: 'app-slovar',
  templateUrl: './slovar.page.html',
  styleUrls: ['./slovar.page.scss'],
})

export class SlovarPage {

  words: Array<{word: string, desc: string, wordLower: string}> = [];

  public query = '';
  public limit = 40;
  public start = 0;

  private source: any[] = (new slovar()).data.words;

  constructor() {
    _.each(this.source, (item) => {
      item.wordLower = item.word.toLowerCase();
    });
    this.words = this.filter('');
  }

  getItems(ev: any): any[] {
    this.query = ev.target.value;
    this.start = 0;
    this.words = this.filter(ev.target.value);
    return;
  }

  filter(query: string): any[] {
    console.log('filter', query);

    if (query && query.trim() !== '') {
      return  this.source.filter((item) => {
        return (item.wordLower.indexOf(query.toLowerCase()) > -1);
      }).slice(this.start, this.start + this.limit);
    } else {
      return this.source.slice(this.start, this.start + this.limit);
    }
  }

  showMore(): void {
    this.start = this.start + this.limit;
    _.each(this.filter(this.query), (item) => {
      this.words.push(item);
    });
  }

}
