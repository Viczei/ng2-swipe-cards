import {
  Directive,
  ElementRef,
  Renderer,
  Output,
  Input,
  EventEmitter,
  HostListener
}
from '@angular/core';

import {DragDropService} from '../common/drag-drop.service';

@Directive({
  selector: '[sc-draggable]'
})
export class DraggableDirective {
  releaseRadius: any;
  element: HTMLElement;
  direction: any = { x: 0, y: 0 };
  @Input() fixed: Boolean = false;
  @Input() orientation: string = 'xy';
  @Input('sc-draggable') data : any;
  @Output() onDrag: EventEmitter<any> = new EventEmitter();
  @Output() onDragEnd: EventEmitter<any> = new EventEmitter();
  @Output() onDragHover: EventEmitter<any> = new EventEmitter();
  @Output() onDrop: EventEmitter<any> = new EventEmitter();

  constructor(
    protected dragDropService: DragDropService,
    protected el: ElementRef,
    protected renderer: Renderer
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    this.dragDropService.subscribe('HOVER', (payload) => {
      if (this === payload.draggable) {
        this.onDrag.emit(payload);
      }
    });
    this.dragDropService.subscribe('DROP', (payload) => {
      if (this === payload.draggable) {
        this.onDrop.emit(payload);
      }
    });
  }

  ngOnChanges(changes) {
    if (changes.orientation) {
      this.orientation = changes.orientation.currentValue || changes.orientation.previousValue || "xy";
    }
  }

  ngAfterViewChecked() {
    if (this.element.parentElement) {
      let height = this.element.parentElement.clientHeight;
      let width = this.element.parentElement.clientWidth;
      this.renderer.setElementStyle(this.element, "height", height + 'px');
      this.renderer.setElementStyle(this.element, "width", width + 'px');
      this.releaseRadius = {
        x: width / 4,
        y: height / 4
      };
    }
  }

  @HostListener('pan', ['$event'])
  public onPan(event: any) {
    if (!this.fixed) {
      this.dragDropService.emit('PAN', { event: event, draggable: this });
      // if (this.onDrag) {
      //   this.onDrag.emit(event);
      // }
      let rotate = ((event.deltaX * 20) / this.element.clientWidth);
      this.direction.x = event.deltaX > 0 ? 1 : -1;
      this.direction.y = event.deltaY > 0 ? 1 : -1;
      this.translate({
        x: event.deltaX,
        y: event.deltaY
      });
    }
  }

  @HostListener('panend', ['$event'])
  public onPanEnd(event: any) {
    if (!this.fixed) {
      this.dragDropService.emit('PAN_END', { event: event, draggable: this });
      // if (this.onDragEnd) {
      //   this.onDragEnd.emit(event);
      // }
      this.translate({
        x: 0,
        y: 0,
        rotate: 0,
        time: 0.2
      });
    }
  }

  protected translate(params: any) {
    if (!this.fixed) {
      this.renderer.setElementStyle(this.element, "transition", "transform " + (params.time || 0) + "s ease");
      this.renderer.setElementStyle(this.element, "webkitTransform", "translate3d(" +
        (params.x && (!this.orientation || this.orientation.indexOf("x") != -1) ? (params.x) : 0) +
        "px, " +
        (params.y && (!this.orientation || this.orientation.indexOf("y") != -1) ? (params.y) : 0) +
        "px, 0) rotate(" + (params.rotate || 0) + "deg)");
    }
  }

}
