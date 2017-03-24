import {
  Directive,
  ElementRef,
  Renderer,
  Output,
  Input,
  EventEmitter
}
from '@angular/core';

import {DragDropService} from '../common/drag-drop.service';

@Directive({
  selector: '[sc-drop-zone]'
})
export class DropZoneDirective {
  emitterId: string;
  element: HTMLElement;
  @Output() onZoneHover: EventEmitter<any> = new EventEmitter();
  @Output() onZoneDrop: EventEmitter<any> = new EventEmitter();
  @Input('sc-drop-zone') data : any;

  constructor(
    private dragDropService: DragDropService,
    protected el: ElementRef,
    public renderer: Renderer
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    this.dragDropService.subscribe('PAN', (payload) => {
      if (
        payload.event.center.x > this.element.offsetLeft
        && payload.event.center.x < this.element.offsetLeft + this.element.clientHeight
        && payload.event.center.y > this.element.offsetTop
        && payload.event.center.y < this.element.offsetTop + this.element.clientHeight
      ) {
        payload.dropZone = this;
        if (this.onZoneHover) {
          this.onZoneHover.emit(payload);
        }
      }
      this.dragDropService.emit('HOVER', payload);
    });

    this.dragDropService.subscribe('PAN_END', (payload) => {
      if (
        payload.event.center.x > this.element.offsetLeft
        && payload.event.center.x < this.element.offsetLeft + this.element.clientWidth
        && payload.event.center.y > this.element.offsetTop
        && payload.event.center.y < this.element.offsetTop + this.element.clientHeight
      ) {
        payload.dropZone = this;
        if (this.onZoneDrop) {
          this.onZoneDrop.emit(payload);
        }
      }
      this.dragDropService.emit('DROP', payload);
    });
  }
}
