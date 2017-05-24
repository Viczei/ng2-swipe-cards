import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

import {SwipeCardsApi} from '@components/swipe-cards/shared/services/swipe-cards-api.service';

@Component({
  moduleId: module.id,
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CardComponent implements AfterViewChecked, OnInit, OnDestroy {
  @Input() card: any;
  @Input() cardElement: any;
  @Input() position: number;
  @Input() beforeSwipeAction: (event: any) => boolean;

  @Input() set config(config) {

    if (config) {
      this._config = config;
    }
  }

  @Input() set orientation(value: string) {
    this._orientation = value || 'xy';
  }

  get config() {
    return this._config;
  }

  get orientation() {
    return this._orientation;
  }

  @Output() onLike: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDislike: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRelease: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSwipe: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAbort: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDisallowed: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSpecial: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeCard: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('overlay') overlay: ElementRef;

  public releaseRadius: any;
  public released: Boolean = false;
  public element: HTMLElement;

  public direction: any = {
    x: 0,
    y: 0
  };

  private _config: any;
  private _orientation = 'xy';

  private swipeActionSubscription: Subscription;

  @HostBinding('class.card-heap') isCardHeapClass = true;

  @HostListener('pan', ['$event'])
  onPan(event: any) {

    if (!this.config.fixed && !this.released && this.position === 0) {
      this.onSwipeCb(event);
    }
  }

  @HostListener('panend', ['$event'])
  onPanEnd(event: any) {

    if (!this.config.fixed && !this.released && this.position === 0) {

      if ((this._orientation === 'x' && (this.releaseRadius.x < event.deltaX || this.releaseRadius.x * -1 > event.deltaX)) || (this._orientation === 'y' && (this.releaseRadius.y < event.deltaY || this.releaseRadius.y * -1 > event.deltaY)) || ((this.releaseRadius.x < event.deltaX || this.releaseRadius.x * -1 > event.deltaX) || (this.releaseRadius.y < event.deltaY || this.releaseRadius.y * -1 > event.deltaY))) {
        this.onReleaseCb(event);
      }
      else {
        this.onAbortCb(event);
      }
    }
  }

  constructor(
    private cd: ChangeDetectorRef,
    protected el: ElementRef,
    private renderer: Renderer2,
    private swipeCardsApi: SwipeCardsApi
  ) {}

  ngOnInit() {

    this.element = this.el.nativeElement;

    this.swipeActionSubscription = this.swipeCardsApi.swipeAction$
      .filter(() => this.position === 0)
      .subscribe((options: any) => {

        if (this.beforeSwipeAction) {

          const canProceedWithAction: boolean = this.beforeSwipeAction({action: options.action, card: this.card});

          if (canProceedWithAction) {
            this.onAction(options.action, options.direction);
          }
          else {
            this.onDisallowed.emit({action: options.action, card: this.card});
          }
        }
        else {
          this.onAction(options.action, options.direction);
        }
      }
    );
  }

  ngAfterViewChecked() {

    if (this.element.parentElement) {

      const height = this.element.parentElement.clientHeight;
      const width = this.element.parentElement.clientWidth;

      this.renderer.setStyle(this.element, 'height', height + 'px');
      this.renderer.setStyle(this.element, 'width', width + 'px');

      this.releaseRadius = {
        x: width / 4,
        y: height / 4
      };
    }
  }

  ngOnDestroy() {
    this.swipeActionSubscription.unsubscribe();
  }

  translate(params: any) {

    if (!this.config.fixed) {
      this.renderer.setStyle(this.element, 'transition', 'transform ' + (params.time || 0) + 's ease');
      this.renderer.setStyle(this.element, 'webkitTransform', `translate3d(${(params.x && (!this._orientation || this._orientation.indexOf('x') !== -1) ? (params.x) : 0)}px, ${(params.y && (!this._orientation || this._orientation.indexOf('y') !== -1) ? (params.y) : 0)}px, 0) rotate(${params.rotate || 0}deg)`);
    }
  }

  onSwipeCb(event: any) {

    const like = (this.orientation === 'y' && event.deltaY < 0) || (this.orientation !== 'y' && event.deltaX > 0);
    const opacity = (event.distance < 0 ? event.distance * -1 : event.distance) * 0.5 / this.element.offsetWidth;

    if (!!this.config.overlay) {

      this.renderer.setStyle(this.overlay.nativeElement, 'transition', 'opacity 0s ease');
      this.renderer.setStyle(this.overlay.nativeElement, 'opacity', opacity.toString());
      this.renderer.setStyle(this.overlay.nativeElement, 'background-color', this.config.overlay[like ? 'like' : 'dislike'].backgroundColor);
    }

    this.translate({
      x: event.deltaX,
      y: event.deltaY,
      rotate: ((event.deltaX * 20) / this.element.clientWidth)
    });

    this.onSwipe.emit(event);
  }

  onAbortCb(event: any): void {

    if (!!this.config.overlay) {
      this.renderer.setStyle(this.overlay.nativeElement, 'transition', 'opacity 0.2s ease');
      this.renderer.setStyle(this.overlay.nativeElement, 'opacity', '0');
    }

    this.translate({
      x: 0,
      y: 0,
      rotate: 0,
      time: 0.2
    });

    this.onAbort.emit(event);
  }

  onReleaseCb(event: any): void {

    this.released = true;

    const like = (this.orientation === 'y' && event.deltaY < 0) || (this.orientation !== 'y' && event.deltaX > 0);

    if (this.beforeSwipeAction) {

      const canProceedWithAction: boolean = this.beforeSwipeAction({action: like ? 'like' : 'dislike', card: this.card});

      if (canProceedWithAction) {
        this.onAction(like ? 'like' : 'dislike', like ? 'right' : 'left');
      }
      else {
        this.onDisallowed.emit({action: like ? 'like' : 'dislike', card: this.card});
      }
    }
    else {
      this.onAction(like ? 'like' : 'dislike', like ? 'right' : 'left');
    }

    this.onRelease.emit(event);
  }

  onAction(action: string, direction: string): void {

    const el = this.element;
    const x = (el.offsetWidth + el.clientWidth) * (direction === 'right' ? 1 : -1);
    const y = (el.offsetHeight + el.clientHeight) * (direction === 'right' ? -1 : 1);

    this.translate({
      x: x,
      y: y,
      rotate: (x * 20) / el.clientWidth,
      time: 0.8
    });

    this.renderer.setStyle(this.overlay.nativeElement, 'transition', 'opacity 0.4s ease');
    this.renderer.setStyle(this.overlay.nativeElement, 'opacity', '0.5');
    this.renderer.setStyle(this.overlay.nativeElement, 'background-color', this.config.overlay[action].backgroundColor);

    switch (action) {
      case 'like': this.onLike.emit({like: true, card: this.card}); break;
      case 'dislike': this.onDislike.emit({like: false, card: this.card}); break;
      case 'special': this.onSpecial.emit({special: true, card: this.card}); break;
    }

    setTimeout(() => {
      this.removeCard.emit(this.card);
    }, 200);
  }
}
