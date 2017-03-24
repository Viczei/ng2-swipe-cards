import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponent } from './components/card';
import { TinderCardDirective } from './directives/tinder-card';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { DraggableDirective } from './directives/draggable.directive';
import { DragDropService } from './common/drag-drop.service';

@NgModule({
  imports: [CommonModule],
  declarations: [
    CardComponent,
    TinderCardDirective,
    DropZoneDirective,
    DraggableDirective
  ],
  exports: [
    CardComponent,
    TinderCardDirective,
    DropZoneDirective,
    DraggableDirective
  ],
  providers: [
    DragDropService
  ]
})
export class SwipeCardsModule { }
