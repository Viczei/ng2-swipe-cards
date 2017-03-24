import {
  Directive,
  ElementRef,
  Renderer,
  Output,
  EventEmitter
}
from '@angular/core';

import {DragDropService} from '../common/drag-drop.service';

import {hover, drop} from '../action/drop.action';

@Directive({
  selector: '[sc-drop-zone]'
})
export class DropZoneDirective {
  emitterId: string;
  element: HTMLElement;
  @Output() onHover: EventEmitter<any> = new EventEmitter();
  @Output() onDrop: EventEmitter<any> = new EventEmitter();

  constructor(
    private dragDropService: DragDropService,
    protected el: ElementRef,
    public renderer: Renderer
  ) {
    this.element = el.nativeElement;
    this.emitterId = dragDropService.getEmitterId();
  }

  ngOnInit() {
    this.dragDropService.subscribe((result) => {
      result.payload.event.source = this.element;
      switch (result.type) {
        case 'DRAG':
          if (
            result.payload.event.center.x > this.element.offsetLeft
            && result.payload.event.center.x < this.element.offsetLeft + this.element.clientHeight
            && result.payload.event.center.y > this.element.offsetTop
            && result.payload.event.center.y < this.element.offsetTop + this.element.clientHeight
          ) {
            if (this.onHover) {
              this.onHover.emit(result.payload.event);
            }
            this.dragDropService.emit(hover(result.payload.event, this.emitterId, result.payload.source_id));
          }
          break;
        case 'RELEASE':
          if (
            result.payload.event.center.x > this.element.offsetLeft
            && result.payload.event.center.x < this.element.offsetLeft + this.element.clientWidth
            && result.payload.event.center.y > this.element.offsetTop
            && result.payload.event.center.y < this.element.offsetTop + this.element.clientHeight
          ) {
            if (this.onDrop) {
              this.onDrop.emit(result.payload.event);
            }
            this.dragDropService.emit(drop(result.payload.event, this.emitterId, result.payload.source_id));
          }
          break;
      }
    });
  }
}
