import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponent } from './components/card';
import { TinderCardDirective } from './directives/tinder-card';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { DragDropService } from './common/drag-drop.service';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class HammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'pan': { enable: true }
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [
    CardComponent,
    TinderCardDirective,
    DropZoneDirective
  ],
  exports: [
    CardComponent,
    TinderCardDirective,
    DropZoneDirective
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    },
    DragDropService
  ]
})
export class SwipeCardsModule { }

export { CardComponent } from './components/card';
export { TinderCardDirective } from './directives/tinder-card';
export { DropZoneDirective } from './directives/drop-zone.directive';
