import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CardComponent, TinderCardComponent } from './components/index';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class HammerConfig extends HammerGestureConfig {
    overrides = <any>{
        'swipe': { velocity: 0.4, threshold: 20 },
        'pan': { enable: true }
    }
}

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        CardComponent,
        TinderCardComponent
    ],
    exports: [
        CardComponent,
        TinderCardComponent
    ],
    entryComponents: [
        CardComponent,
        TinderCardComponent
    ],
    providers: [{
        provide: HAMMER_GESTURE_CONFIG,
        useClass: HammerConfig
    }]
})
export class SwipeCardsModule { }
