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

  @ViewChild('cardLog') public cardLogContainer: any;
  @ViewChild('tinderCardLog') public tinderCardLogContainer: any;

  public cards: any[] = [];
  public cardCursor: number = 0;
  public orientation: string = 'x';
  public overlay: any = {
    like: {
      backgroundColor: '#28e93b'
    },
    dislike: {
      backgroundColor: '#e92828'
    }
  };

  public cardLogs: any = [];
  public tinderCardLogs: any = [];

  constructor(
    private catsService: CatsService
  ) {
    this.catsService.get().forEach((cat) => {
      cat.likeEvent = new EventEmitter();
      cat.destroyEvent = new EventEmitter();
      this.cards.push(cat);
    });
  }

  public like(like) {
    let self = this;
    if (this.cards.length > 0) {
      self.cards[this.cardCursor++].likeEvent.emit({ like });
      // DO STUFF WITH YOUR CARD
      this.tinderCardLogs.push('callLike(' + JSON.stringify({ like }) + ')');
      this.scrollToBottom(this.tinderCardLogContainer);
    }
  }

  public onRelease(event) {
    this.cardLogs.push('onRelease(event)');
    this.scrollToBottom(this.cardLogContainer);

  }

  public onAbort(event) {
    this.cardLogs.push('onAbort(event)');
    this.scrollToBottom(this.cardLogContainer);
  }

  public onSwipe(event) {
    this.cardLogs.push('onSwipe(event)');
    this.scrollToBottom(this.cardLogContainer);
  }

  public onDrop(event) {
    console.log(event);
  }

  public onCardLike(event) {
    let item = this.cards[this.cardCursor++];
    // DO STUFF WITH YOUR CARD
    this.tinderCardLogs.push('onLike(' + JSON.stringify(event) + ')');
    this.scrollToBottom(this.tinderCardLogContainer);
  }

  private getKittenUrl() {
    let w = 500 - Math.floor((Math.random() * 100) + 1);
    let h = 500 - Math.floor((Math.random() * 100) + 1);
    return 'http://placekitten.com/' + w + '/' + h;
  }

  private scrollToBottom(el) {
    setTimeout(() => {
      if (el) {
        el.nativeElement.scrollTop = el.nativeElement.scrollHeight;
      }
    }, 100);
  }

}
