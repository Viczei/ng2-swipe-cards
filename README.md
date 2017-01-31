# ng2-swipe-cards
A kit of cards (including tinder-card) for angular2

# Installation
```bash
$ npm install ng2-swipe-cards --save
```

# Demo
https://embed.plnkr.co/ebTZz51SsYUs7wzLemuo/

or clone the project and:
```bash
$ npm install && npm run build && npm start
```

# Usage

For webpack consumers, first, import SwipeableCardModule to your entry AppModule file,

```bash
// Root app module file
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SwipeCardsModule } from 'ng2-swipe-cards';

import { AppComponent } from './app/';

@NgModule({
  imports: [
    BrowserModule,
    SwipeCardsModule
    ...
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
});
```

Then, import ng2-swipe-cards and hammerjs in your vendor.ts file,
```bash
// vendor.ts file
import '@angular/common';
import '@angular/core';
...

import 'hammerjs';
import 'ng2-swipe-cards';
```

# Documentation

The package contains one component called: sc-card. it basically display a card that you can drag and drop.

It's inputs are:
fixed: Boolean => set condition to forbid any drag and drop
orientation: String => set 'x' to only allow horizontal drags, set 'y' to only allow vertical drags and 'xy' for both
callDestroy: EventEmitter => emit to destroy the card

It's outputs are:
onRelease: EventEmitter => called when the card is dropped outside it's release radius
onSwipe: EventEmitter => called when the card is dragged
onAbort: EventEmitter => called when the card is dropped inside it's release radius.


The package contains a directive called: tinder-card. It reproduce the like/dislike functions from the tinder card application.

It's inputs are:
tinder-card: object => set an object with this pattern:
```bash
{
  'like':
  {
    'backgroundColor': 'green',
    'img': 'anyLikeImage.png'
  },
  'dislike':
  {
    'backgroundColor': 'red',
    'img': 'anyDislikeImage.png'
  }
}
```
It will automatically generate an overlay above your card which display the 'backgroundColor' and 'img' depending on whether the card is beeing liked or disliked. (This is optional)
callLike: EventEmitter => emit to force a like action on the card heap. You can set as argument a boolean as liking.

It's ouputs are:
onLike: EventEmitter => called when the card is liked or disliked from the release action.
