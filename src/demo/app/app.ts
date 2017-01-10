import { Component, ViewEncapsulation, ViewChild, TemplateRef, EventEmitter, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SwipeCardsModule } from '../../components/ng2-swipe-cards';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styles: [`[role="button"],
    input[type="submit"],
    input[type="reset"],
    input[type="button"],
    button {
        -webkit-box-sizing: content-box;
           -moz-box-sizing: content-box;
                box-sizing: content-box;
    }

    input[type="submit"],
    input[type="reset"],
    input[type="button"],
    button {
        background: none;
        border: 0;
        color: inherit;
        font: inherit;
        line-height: normal;
        overflow: visible;
        padding: 0;
        -webkit-appearance: button;
        -webkit-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
    }
    input::-moz-focus-inner,
    button::-moz-focus-inner {
        border: 0;
        padding: 0;
    }

    [role="button"] {
        color: inherit;
        cursor: default;
        display: inline-block;
        text-align: center;
        text-decoration: none;
        white-space: pre;
        -webkit-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
    }

    [role="button"],
    input[type="submit"],
    input[type="reset"],
    input[type="button"],
    button {
        background-color: #f0f0f0;
        border: 1px solid rgb(0, 0, 0);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 0.25em;
        height: 2.5em;
        line-height: 2.5;
        margin: 0.25em;
        padding: 0 1em;
        width: 14em;
    }

    html, body {
        margin: 0;
        height: 100%;
        overflow: hidden;
    }

    .footer {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 20px;
    }

    .left-panel {
      float:left;
      height:100%;
      width:60%;
    }

    .right-panel {
      float:right;
      height:100%;
      width:40%;
    }

    .card-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height:80%;
      width:80%;
      margin:10px auto;
    }

    sc-card {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      max-height: 800px;
      max-width: 800px;
    }

    .card-header span {
      position:absolute;
      top:5px;
      left:5px;
      width:30px;
      height:30px;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      border-radius: 15px;
      background-color: #E1E1E1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-content {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

    }

    .card-content img {
      max-width:90%;
      max-height:90%;
    }

    .buttons {
      width:100%;
      margin-top: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;;
    }

    .buttons button {
      background-color: #E1E1E1;
      max-width:160px;
      width:50%;
    }

    .log-container {
      margin:auto;
      width:96%;
      height:20%;
      border: 1px solid black;
      overflow-y: scroll;
    }

    .log-container span {
      display:block;
      width:100%;
    }
`],
  templateUrl: './app.html'
})
export class App {
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


  constructor() {
    for (var i = 0; i < 50; i++) {
      this.cards.push({
        id: i + 1,
        likeEvent: new EventEmitter(),
        destroyEvent: new EventEmitter(),
        url: this.getKittenUrl()
      });
    }
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

  scrollToBottom(el) {
    setTimeout(() => {
      el.nativeElement.scrollTop = el.nativeElement.scrollHeight;
    }, 100);
  }
}

@NgModule({
  imports: [BrowserModule, FormsModule, SwipeCardsModule],
  declarations: [App],
  bootstrap: [App]
})
export class AppModule { }
