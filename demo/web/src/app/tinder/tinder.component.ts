import { Component, ViewEncapsulation, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { CatsService } from '../common';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Tinder` component loaded asynchronously');

@Component({
  selector: 'tinder',
  styleUrls: ['tinder.css'],
  templateUrl: 'tinder.html',
})
export class TinderComponent {

  @ViewChild('cardLog') cardLogContainer: any;
  @ViewChild('tinderCardLog') tinderCardLogContainer: any;

  cards: any[] = [];
  cardCursor: number = 0;
  orientation: string = "x";
  overlay: any = {
    like: {
      backgroundColor: '#28e93b'
    },
    dislike: {
      backgroundColor: '#e92828'
    }
  };

  cardLogs: any = [];
  tinderCardLogs: any = [];


  constructor(
    private catsService: CatsService
  ) {
    this.catsService.get().forEach((cat) => {
      cat.likeEvent = new EventEmitter();
      cat.destroyEvent = new EventEmitter();
      this.cards.push(cat);
    });
  }

  like(like) {
    var self = this;
    if (this.cards.length > 0) {
      self.cards[this.cardCursor++].likeEvent.emit({ like });
      // DO STUFF WITH YOUR CARD
      this.tinderCardLogs.push("callLike(" + JSON.stringify({ like }) + ")");
      this.scrollToBottom(this.tinderCardLogContainer);
    }
  }

  onCardLike(event) {
    var item = this.cards[this.cardCursor++];
    // DO STUFF WITH YOUR CARD
    this.tinderCardLogs.push("onLike(" + JSON.stringify(event) + ")");
    this.scrollToBottom(this.tinderCardLogContainer);
  }

  getKittenUrl() {
    var w = 500 - Math.floor((Math.random() * 100) + 1);
    var h = 500 - Math.floor((Math.random() * 100) + 1);
    return "http://placekitten.com/" + w + "/" + h;
  }

  onRelease(event) {
    this.cardLogs.push("onRelease(event)");
    this.scrollToBottom(this.cardLogContainer);

  }

  onAbort(event) {
    this.cardLogs.push("onAbort(event)");
    this.scrollToBottom(this.cardLogContainer);
  }

  onSwipe(event) {
    this.cardLogs.push("onSwipe(event)");
    this.scrollToBottom(this.cardLogContainer);
  }

  onDrop(event) {
    console.log(event);
  }

  scrollToBottom(el) {
    setTimeout(() => {
      if (el) {
        el.nativeElement.scrollTop = el.nativeElement.scrollHeight;
      }
    }, 100);
  }

}
