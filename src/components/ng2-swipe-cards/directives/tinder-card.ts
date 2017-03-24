import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Renderer,
  Input,
  Output
}
from '@angular/core';

import {
  DraggableDirective
} from './draggable.directive';

import {DragDropService} from '../common/drag-drop.service';

@Directive({
  selector: '[tinder-card]',
  host: {
    class: 'card-heap'
  }
})
export class TinderCardDirective extends DraggableDirective {
  @Input('tinder-card') overlay: any;
  @Input() callLike: EventEmitter<any>;
  @Input() fixed: boolean;
  @Input() orientation: string = 'xy';

  @Output() onRelease: EventEmitter<any> = new EventEmitter();
  @Output() onSwipe: EventEmitter<any> = new EventEmitter();
  @Output() onAbort: EventEmitter<any> = new EventEmitter();
  @Output() onLike: EventEmitter<any> = new EventEmitter();

  like: boolean;

  element: HTMLElement;
  overlayElement: HTMLElement;

  constructor(
    protected dragDropService: DragDropService,
    protected el: ElementRef,
    protected renderer: Renderer
  ) {
    super(dragDropService, el, renderer);
    this.element = el.nativeElement;
  }

  onReleaseLikeCb(event: any) {
    this.like = event.like;
    let el = this.element;
    let x = (el.offsetWidth + el.clientWidth) * ((!!event.like ? 1 : -1) || 0);
    let rotate = (x * 20) / el.clientWidth;

    if (this.overlay) {
      let overlayElm = <HTMLElement>this.element.querySelector('.tinder-overlay');
      this.renderer.setElementStyle(overlayElm, "transition", "transform 0.6s ease");
      this.renderer.setElementStyle(overlayElm, "opacity", "0.5");
    }
  }

  onSwipeLikeCb(event: any) {
    if (this.overlay) {
      let rotate = ((event.deltaX * 20) / this.element.clientWidth);
      this.direction.x = event.deltaX > 0 ? 1 : -1;
      this.direction.y = event.deltaY > 0 ? 1 : -1;
      this.translate({
        x: event.deltaX,
        y: event.deltaY
      });
      let overlayElm = <HTMLElement>this.element.querySelector('.tinder-overlay');
      this.renderer.setElementStyle(overlayElm, "transition", "opacity 0s ease");
      let opacity = (event.distance < 0 ? event.distance * -1 : event.distance) * 0.5 / this.element.offsetWidth;
      this.renderer.setElementStyle(overlayElm, "opacity", opacity.toString());
    }
  }

  private onAbortCb(event: any) {
    this.translate({
      x: 0,
      y: 0,
      rotate: 0,
      time: 0.2
    });
  }

  destroy(delay: number = 0) {
    setTimeout(() => {
      this.element.remove();
    }, 200);
  }

  @HostListener('pan', ['$event'])
  public onPan(event: any) {
    super.onPan(event);
    let like = (this.orientation === "y" && event.deltaY < 0) ||
      (this.orientation !== "y" && event.deltaX > 0);
    let opacity = (event.distance < 0 ? event.distance * -1 : event.distance) * 0.5 / this.element.offsetWidth;
    if (!!this.overlay) {
      this.renderer.setElementStyle(this.overlayElement, "transition", "opacity 0s ease");
      this.renderer.setElementStyle(this.overlayElement, "opacity", opacity.toString());
      this.renderer.setElementStyle(this.overlayElement, "background-color", this.overlay[like ? "like" : "dislike"].backgroundColor);
    }
    this.onSwipe.emit();
    this.translate({
      x: event.deltaX,
      y: event.deltaY,
      rotate: ((event.deltaX * 20) / this.element.clientWidth)
    });
  }

  @HostListener('panend', ['$event'])
  public onPanEnd(event: any) {
    super.onPanEnd(event);
    if (!this.fixed) {
      this.dragDropService.emit('PAN_END', { event: event, draggable: this });
      if (
        (this.orientation == "x" && (this.releaseRadius.x < event.deltaX || this.releaseRadius.x * -1 > event.deltaX)) ||
        (this.orientation == "y" && (this.releaseRadius.y < event.deltaY || this.releaseRadius.y * -1 > event.deltaY)) ||
        ((this.releaseRadius.x < event.deltaX || this.releaseRadius.x * -1 > event.deltaX) ||
          (this.releaseRadius.y < event.deltaY || this.releaseRadius.y * -1 > event.deltaY))
      ) {
        let like = (this.orientation === "y" && event.deltaY < 0) ||
          (this.orientation !== "y" && event.deltaX > 0);
        if (this.callLike) {
          this.callLike.emit({ like });
        }
        if (this.onLike) {
          this.onLike.emit({ like });
        }
        if (this.onRelease) {
          this.onRelease.emit(event);
        }
      } else {
        if (!!this.overlay) {
          this.renderer.setElementStyle(this.overlayElement, "transition", "opacity 0.2s ease");
          this.renderer.setElementStyle(this.overlayElement, "opacity", "0");
        }
        if (this.onAbort) {
          this.onAbort.emit(event);
        }
      }
    }
  }

  translate(params: any) {
    if (!this.fixed) {
      this.renderer.setElementStyle(this.element, "transition", "transform " + (params.time || 0) + "s ease");
      this.renderer.setElementStyle(this.element, "webkitTransform", "translate3d(" +
        (params.x && (!this.orientation || this.orientation.indexOf("x") != -1) ? (params.x) : 0) +
        "px, " +
        (params.y && (!this.orientation || this.orientation.indexOf("y") != -1) ? (params.y) : 0) +
        "px, 0) rotate(" +
        params.rotate +
        "deg)");
    }
  }

  initOverlay() {
    if (!!this.overlay) {
      this.overlayElement = document.createElement("div");
      this.overlayElement.className += " card-overlay";
      this.element.appendChild(this.overlayElement);
      this.renderer.setElementStyle(this.overlayElement, "transform", "translateZ(0)");
      this.renderer.setElementStyle(this.overlayElement, "opacity", "0");
      this.renderer.setElementStyle(this.overlayElement, "border-radius", "2px");
      this.renderer.setElementStyle(this.overlayElement, "position", "absolute");
      this.renderer.setElementStyle(this.overlayElement, "width", "calc(100%)");
      this.renderer.setElementStyle(this.overlayElement, "height", "calc(100%)");
      this.renderer.setElementStyle(this.overlayElement, "top", "0");
      this.renderer.setElementStyle(this.overlayElement, "left", "0");
      this.renderer.setElementStyle(this.overlayElement, "display", "flex");
      this.renderer.setElementStyle(this.overlayElement, "align-items", "center");
      this.renderer.setElementStyle(this.overlayElement, "justify-content", "center");
      this.renderer.setElementStyle(this.overlayElement, "overflow", "hidden");
      this.renderer.setElementStyle(this.overlayElement, "color", "white");
    }
  }

  ngOnInit() {
    this.initOverlay();

    this.overlay = this.overlay || {};
    this.orientation = this.orientation || "xy";
    this.callLike = this.callLike || new EventEmitter();
    this.initCallLike();
  }

  initCallLike() {
    this.callLike.subscribe((params: any) => {
      let el = this.element;
      let x = (el.offsetWidth + el.clientWidth) * (params.like ? 1 : -1);
      let y = (el.offsetHeight + el.clientHeight) * (params.like ? -1 : 1);
      this.translate({
        x: x,
        y: y,
        rotate: (x * 20) / el.clientWidth,
        time: 0.8
      });
      this.renderer.setElementStyle(this.overlayElement, "transition", "opacity 0.4s ease");
      this.renderer.setElementStyle(this.overlayElement, "opacity", "0.5");
      this.renderer.setElementStyle(this.overlayElement, "background-color", this.overlay[params.like ? "like" : "dislike"].backgroundColor);
      this.destroy(200);
    });
  }

  ngOnChanges(changes) {
    if (changes.callLike) {
      this.callLike = changes.callLike.currentValue || changes.callLike.previousValue || new EventEmitter();
      this.initCallLike();
    }
    if (changes.overlay) {
      this.overlay = changes.overlay.currentValue || changes.overlay.previousValue || {};
    }
  }

  ngOnDestroy() {
    if (this.callLike) {
      this.callLike.unsubscribe();
    }
  }
}
