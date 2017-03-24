import { Component, ViewEncapsulation, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { CatsService } from '../common';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Grid` component loaded asynchronously');

@Component({
  selector: 'grid',
  styleUrls: ['grid.css'],
  templateUrl: 'grid.html',
})
export class GridComponent {

  public cards: any[] = [];
  public currentIndex: number = 0;

  constructor(
    private catsService: CatsService
  ) {
    this.catsService.get().forEach((cat) => {
      cat.likeEvent = new EventEmitter();
      cat.destroyEvent = new EventEmitter();
      this.cards.push(cat);
    });
  }

  public onDrag(event, i) {
    console.log(event, i);
  }

  public onDragEnd(event) {
    console.log(event);
  }

  public onZoneDrop(event) {
    console.log('onZoneDrop', event);
  }

  public onZoneHover(event) {
    console.log('onZoneHover', event);
  }

  public onDragDrop(event, i) {
    console.log('onDragDrop', event, i);
    this.cards.splice(i, 1);
  }

  public onDragHover(event, i) {
    console.log('onDragHover', event);
  }

}
