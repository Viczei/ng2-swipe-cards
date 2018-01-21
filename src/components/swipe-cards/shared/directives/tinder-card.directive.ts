import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer
} from '@angular/core';


@Directive({
  selector: '[tinder-card]'
})

export class TinderCardDirective implements OnChanges, OnDestroy, OnInit {
  @Input() card: any;

  @Input() set overlay(value: any) {
    this._overlay = value || {};
  }

  @Input() set callLike(value: EventEmitter<any>) {
    this._callLike = value || new EventEmitter<any>();
    this.initCallLike();
  }

  @Input() set callDislike(value: EventEmitter<any>) {
    this._callDislike = value || new EventEmitter<any>();
    this.initCallDislike();
  }

  @Input() fixed: boolean;
  @Input() orientation = 'xy';
  @Output() onLike: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDislike: EventEmitter<any> = new EventEmitter<any>();

  get overlay() {
    return this._overlay;
  }

  get callLike() {
    return this._callLike;
  }

  public like: boolean;

  public element: HTMLElement;
  public renderer: Renderer;
  public overlayElement: HTMLElement;

  private _overlay: any;
  private _callLike: EventEmitter<any>;
  private _callDislike: EventEmitter<any>;

  // @HostBinding('class.card-heap') isCardHeapClass = true;

  // @HostListener('onSwipe', ['$event'])
  // onSwipe(event: any) {

  //   const like = (this.orientation === 'y' && event.deltaY < 0) || (this.orientation !== 'y' && event.deltaX > 0);
  //   const opacity = (event.distance < 0 ? event.distance * -1 : event.distance) * 0.5 / this.element.offsetWidth;

  //   if (!!this._overlay) {

  //     this.renderer.setElementStyle(this.overlayElement, 'transition', 'opacity 0s ease');
  //     this.renderer.setElementStyle(this.overlayElement, 'opacity', opacity.toString());
  //     this.renderer.setElementStyle(this.overlayElement, 'background-color', this._overlay[like ? 'like' : 'dislike'].backgroundColor);
  //   }

  //   this.translate({
  //     x: event.deltaX,
  //     y: event.deltaY,
  //     rotate: ((event.deltaX * 20) / this.element.clientWidth)
  //   });
  // }

  // @HostListener('onAbort', ['$event'])
  // onAbort(event: any) {

  //   if (!!this._overlay) {
  //     this.renderer.setElementStyle(this.overlayElement, 'transition', 'opacity 0.2s ease');
  //     this.renderer.setElementStyle(this.overlayElement, 'opacity', '0');
  //   }
  // }

  // @HostListener('onRelease', ['$event'])
  // onRelease(event: any) {

  //   const like = (this.orientation === 'y' && event.deltaY < 0) || (this.orientation !== 'y' && event.deltaX > 0);

  //   if (like) {

  //     if (this._callLike) {
  //       this._callLike.emit({like: like, card: this.card});
  //     }

  //     if (this.onLike) {
  //       this.onLike.emit({like: like, card: this.card});
  //     }
  //   }
  //   else {

  //     if (this._callLike) {
  //       this._callLike.emit({like: like, card: this.card});
  //     }

  //     if (this.onLike) {
  //       this.onLike.emit({like: like, card: this.card});
  //     }
  //     this.onDislike.emit({like: false, card: this.card});
  //   }


  // }

  constructor(el: ElementRef, renderer: Renderer) {
    this.renderer = renderer;
    this.element = el.nativeElement;
  }

  ngOnInit() {
    this.initOverlay();

    this._overlay = this._overlay || {};
    this.orientation = this.orientation || 'xy';
    this._callLike = this._callLike || new EventEmitter();
    this.initCallLike();
  }

  ngOnChanges(changes) {

    if (changes.callLike) {
      this._callLike = changes.callLike.currentValue || changes.callLike.previousValue || new EventEmitter();
      this.initCallLike();
    }

    if (changes.overlay) {
      this._overlay = changes.overlay.currentValue || changes.overlay.previousValue || {};
    }
  }

  ngOnDestroy() {

    if (this._callLike) {
      this._callLike.unsubscribe();
    }
  }

  onReleaseLikeCb(event: any) {

    this.like = event.like;

    const el = this.element;
    const x = (el.offsetWidth + el.clientWidth) * ((!!event.like ? 1 : -1) || 0);
    const rotate = (x * 20) / el.clientWidth;

    if (this._overlay) {
      const overlayElm = <HTMLElement>this.element.querySelector('.tinder-overlay');
      this.renderer.setElementStyle(overlayElm, 'transition', 'transform 0.6s ease');
      this.renderer.setElementStyle(overlayElm, 'opacity', '0.5');
    }
  }

  onSwipeLikeCb(event: any) {

    if (this._overlay) {

      const overlayElm = <HTMLElement>this.element.querySelector('.tinder-overlay');
      const opacity = (event.distance < 0 ? event.distance * -1 : event.distance) * 0.5 / this.element.offsetWidth;

      this.renderer.setElementStyle(overlayElm, 'transition', 'opacity 0s ease');
      this.renderer.setElementStyle(overlayElm, 'opacity', opacity.toString());
    }
  }

  destroy(delay: number = 0) {

    setTimeout(() => {
      this.element.remove();
    }, delay);
  }

  translate(params: any) {

    if (!this.fixed) {

      this.renderer.setElementStyle(this.element, 'transition', 'transform ' + (params.time || 0) + 's ease');
      this.renderer.setElementStyle(this.element, 'webkitTransform', 'translate3d(' +
        (params.x && (!this.orientation || this.orientation.indexOf('x') !== -1) ? (params.x) : 0) +
        'px, ' +
        (params.y && (!this.orientation || this.orientation.indexOf('y') !== -1) ? (params.y) : 0) +
        'px, 0) rotate(' +
        params.rotate +
        'deg)');
    }
  }

  initOverlay() {

    if (!!this._overlay) {

      this.overlayElement = document.createElement('div');
      this.overlayElement.className += ' card-overlay';

      this.element.appendChild(this.overlayElement);

      this.renderer.setElementStyle(this.overlayElement, 'transform', 'translateZ(0)');
      this.renderer.setElementStyle(this.overlayElement, 'opacity', '0');
      this.renderer.setElementStyle(this.overlayElement, 'border-radius', '2px');
      this.renderer.setElementStyle(this.overlayElement, 'position', 'absolute');
      this.renderer.setElementStyle(this.overlayElement, 'width', '100%');
      this.renderer.setElementStyle(this.overlayElement, 'height', '100%');
      this.renderer.setElementStyle(this.overlayElement, 'top', '0');
      this.renderer.setElementStyle(this.overlayElement, 'left', '0');
      this.renderer.setElementStyle(this.overlayElement, 'display', 'flex');
      this.renderer.setElementStyle(this.overlayElement, 'align-items', 'center');
      this.renderer.setElementStyle(this.overlayElement, 'justify-content', 'center');
      this.renderer.setElementStyle(this.overlayElement, 'overflow', 'hidden');
      this.renderer.setElementStyle(this.overlayElement, 'color', 'white');
    }
  }

  initCallLike() {

    this._callLike.subscribe((params: any) => {

      const el = this.element;
      const x = (el.offsetWidth + el.clientWidth) * (params.like ? 1 : -1);
      const y = (el.offsetHeight + el.clientHeight) * (params.like ? -1 : 1);

      this.translate({
        x: x,
        y: y,
        rotate: (x * 20) / el.clientWidth,
        time: 0.8
      });

      this.renderer.setElementStyle(this.overlayElement, 'transition', 'opacity 0.4s ease');
      this.renderer.setElementStyle(this.overlayElement, 'opacity', '0.5');
      this.renderer.setElementStyle(this.overlayElement, 'background-color', this._overlay[params.like ? 'like' : 'dislike'].backgroundColor);

      this.destroy(200);
    });
  }

  initCallDislike() {

    this._callLike.subscribe((params: any) => {

      const el = this.element;
      const x = (el.offsetWidth + el.clientWidth) * (params.like ? 1 : -1);
      const y = (el.offsetHeight + el.clientHeight) * (params.like ? -1 : 1);

      this.translate({
        x: x,
        y: y,
        rotate: (x * 20) / el.clientWidth,
        time: 0.8
      });

      this.renderer.setElementStyle(this.overlayElement, 'transition', 'opacity 0.4s ease');
      this.renderer.setElementStyle(this.overlayElement, 'opacity', '0.5');
      this.renderer.setElementStyle(this.overlayElement, 'background-color', this._overlay[params.like ? 'like' : 'dislike'].backgroundColor);

      this.destroy(200);
    });
  }
}
