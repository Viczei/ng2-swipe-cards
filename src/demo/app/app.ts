import { Component, ViewEncapsulation, ViewChild, TemplateRef, EventEmitter, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SwipeCardsModule } from '../../components/ng2-swipe-cards';

@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.css'
    ],
    templateUrl: './app.html'
})
export class App {
    @ViewChild('myTemplate', { read: TemplateRef }) public myTemplate: TemplateRef<any>;
    cards: any[] = [];
    cardCursor: number = 0;

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

    getOverlay() {
        return {
            like: {
                backgroundColor: 'green'
            },
            dislike: {
                backgroundColor: 'red'
            }
        }
    }

    like(like) {
        var self = this;
        if (this.cards.length > 0) {
            self.cards[this.cardCursor++].likeEvent.emit({ like });
            // DO STUFF WITH YOUR CARD
            console.log('like:', like);
        }
    }

    onCardLike(event) {
        var item = this.cards[this.cardCursor++];
        // DO STUFF WITH YOUR CARD
        console.log('like:', event.like);
    }

    getKittenUrl() {
        var w = 500 - Math.floor((Math.random() * 100) + 1);
        var h = 500 - Math.floor((Math.random() * 100) + 1);
        return "http://placekitten.com/" + w + "/" + h;
    }
}

@NgModule({
    imports: [BrowserModule, SwipeCardsModule],
    declarations: [App],
    bootstrap: [App]
})
export class AppModule { }
