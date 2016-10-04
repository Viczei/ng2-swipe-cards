import { Component, ViewEncapsulation, ViewChild, TemplateRef, EventEmitter } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: './home.tpl.html',
    encapsulation: ViewEncapsulation.None
})
export class Home {
    @ViewChild('myTemplate', { read: TemplateRef }) public myTemplate: TemplateRef<any>;
    cards: any[] = [];
    cardCursor: number = 0;

    constructor() {
        for (var i = 0; i < 50; i++) {
            this.cards.push({
                id: i + 1,
                likeEvent: new EventEmitter(),
                destroyEvent: new EventEmitter()
            });
        }
    }

    like(like) {
        var self = this;
        if (this.cards.length > 0) {
            self.cards[this.cardCursor++].likeEvent.emit({ like });
            // DO STUFF WITH YOUR CARD
        }
    }

    onCardRelease(element) {
        var item = this.cards[this.cardCursor++];
        // DO STUFF WITH YOUR CARD
    }
}
