import { NgModule }      from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { SwipeCardsModule } from '../../components/ng2-swipe-cards';
import { CardComponent } from '../../components/ng2-swipe-cards/components';
import { TinderCardComponent } from '../../components/ng2-swipe-cards/components';

import { App }  from './app';
import { Home } from './home/home';
import { routing } from './app.routes';

@NgModule({
    imports: [
        BrowserModule,
        routing,
        SwipeCardsModule
    ],
    declarations: [App, Home],
    bootstrap: [App],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]
})
export class AppModule { }
