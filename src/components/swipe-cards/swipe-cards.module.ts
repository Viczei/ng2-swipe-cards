import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CardModule} from './shared/components/card.module';
import {ActionDirective} from './shared/directives/action.directive';
import {SwipeCardsComponent} from './swipe-cards.component';

import {HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';

export class HammerConfig extends HammerGestureConfig {
  overrides = <any> {
    'pan': { enable: true }
  };
}

@NgModule({
  imports: [
    CommonModule,
    CardModule
  ],
  declarations: [
    SwipeCardsComponent,
    ActionDirective
  ],
  exports: [
    SwipeCardsComponent,
    ActionDirective
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: HammerConfig
  }]
})

export class SwipeCardsModule {}
