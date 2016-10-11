import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CardComponent } from './components/card';
import { TinderCardDirective } from './directives/tinder-card';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class HammerConfig extends HammerGestureConfig {
    overrides = <any>{
        'pan': { enable: true }
    }
}

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        CardComponent,
        TinderCardDirective
    ],
    exports: [
        CardComponent,
        TinderCardDirective
    ],
    entryComponents: [
        CardComponent
    ],
    providers: [{
        provide: HAMMER_GESTURE_CONFIG,
        useClass: HammerConfig
    }]
})
export class SwipeCardsModule { }
