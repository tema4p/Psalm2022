import {Component} from '@angular/core';
import {each} from 'lodash';
import Slovar from '../../data/slovar';

export interface IWord {
  word: string;
  desc: string;
  wordLower?: string;
}

@Component({
  selector: 'app-slovar',
  templateUrl: './slovar.page.html',
  styleUrls: ['./slovar.page.scss'],
})

export class SlovarPage {
  public words: IWord[] = [];
  public query = '';
  public limit = 40;
  public start = 0;
  private source: IWord[] = (new Slovar()).data;

  constructor() {
    each(this.source, (item) => {
      item.wordLower = item.word.toLowerCase();
    });
    this.words = this.filter('');
  }

  getItems(ev: Event | any) {
    this.query = ev.target.value;
    this.start = 0;
    this.words = this.filter(ev.target.value);
  }

  filter(query: string): IWord[] {
    if (query && query.trim() !== '') {
      return  this.source
        .filter((item) => (item.wordLower.indexOf(query.toLowerCase()) > -1))
        .slice(this.start, this.start + this.limit);
    } else {
      return this.source.slice(this.start, this.start + this.limit);
    }
  }

  showMore() {
    this.start = this.start + this.limit;
    each(this.filter(this.query), (item) => {
      this.words.push(item);
    });
  }
}
