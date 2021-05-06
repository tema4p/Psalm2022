import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import addsRu from '../../data/adds-ru';
import addsCs from '../../data/adds-cs';

@Component({
  selector: 'adds',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.scss'],
})

export class AddsComponent implements OnInit, OnChanges {
  @Input() addsId: string;
  @Input() settings: any;
  data: string;

  constructor() {}
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    let source: any;

    if (this.addsId) {
      let add: string = this.addsId;
      if (this.settings.textSource === 'ru') {
        source = (new addsRu()).data;
      } else if (this.settings.textSource === 'cs') {
        source = (new addsCs()).data;
      }
      if (this.addsId === 'slava') {
        if (this.settings.repose) {
          add = 'repose';
        } else if (!this.settings.adds) {
          add = 'slavaShort';
        }
      }

      if (this.addsId === 'slavaPre' && !this.settings.adds) {
        add = 'slavaPreShort';
      }

      if (this.addsId === 'trisv' && !this.settings.adds) {
        add = 'trisvShort';
      }

      if (this.addsId === 'repose' && !this.settings.adds) {
        add = 'slavaShort';
      }

      this.data = source[add].data;
    }
  }
}