import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Renderer,
  Input,
  Output
} from '@angular/core';

@Component({
  template: '<ng-content></ng-content>',
  selector: 'sc-card',
  styles: [`:host {
      transition: transform 1s ease;
      position: absolute;
      border-radius: 2px;
      border: 1px solid white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
      transition: transform 0.2s ease;
      background-color: white;
      touch-action: none !important;
    }
    :host(.card-heap) {
      transition: transform 1s ease;
      display: block;
      position: absolute;
      background-color: white;
      box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
      transform: perspective(400px) translate3d(0, 30px, -30px);
      visibility: hidden;
    }

    :host(.card-heap):nth-child(1) {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
      z-index:3;
      visibility: visible;
      transform: perspective(400px) translate3d(0, 0px, 0px);
    }
    :host(.card-heap):nth-child(2) {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
      z-index:2;
      visibility: visible;
      transform: perspective(400px) translate3d(0, 30px, -30px);
    }
    :host(.card-heap):nth-child(3) {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
      z-index:1;
      visibility: visible;
      transform: perspective(400px) translate3d(0, 60px, -60px);
    }

    :host .card-overlay {
      transform: translateZ(0);
      opacity: 0;
      border-radius: 2px;
      position: absolute;
      width: calc(100%);
      height: 10px;
      /*height: calc(100%);*/
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: white;
    }
`]
})
export class CardComponent {
  @Input() callDestroy: EventEmitter<any>;

  element: HTMLElement;

  constructor(
    protected el: ElementRef,
    public renderer: Renderer
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    this.callDestroy = this.callDestroy || new EventEmitter();
    this.initCallDestroy();
  }

  initCallDestroy() {
    this.callDestroy.subscribe((delay: number) => {
      this.destroy(delay);
    });
  }

  ngOnChanges(changes) {
    if (changes.callDestroy) {
      this.callDestroy = changes.callDestroy.currentValue || changes.callDestroy.previousValue || new EventEmitter();
      this.initCallDestroy();
    }
  }

  destroy(delay: number = 0) {
    setTimeout(() => {
      this.element.remove();
    }, 200);
  }

  ngOnDestroy() {
    if (this.callDestroy) {
      this.callDestroy.unsubscribe();
    }
  }

}
