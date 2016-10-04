# ng2-swipe-cards
A kit of cards (including tinder-card) for angular2

# Installation
```bash
$ npm install ng2-swipe-cards --save
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
