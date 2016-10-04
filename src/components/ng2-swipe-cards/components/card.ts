import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener
} from '@angular/core';

@Component({
    template: '<ng-content></ng-content>',
    selector: 'mb-card',
    styles: [':host {\
      transition: transform 1s ease;\
      position: absolute;\
      border-radius: 2px;\
      border: 1px solid white;\
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\
      transition: transform 0.2s ease;\
    }\
  '],
    inputs: ['orientation', 'fixed', 'callDestroy'],
    outputs: ['onRelease', 'onSwipe']
})
export class CardComponent {
    orientation: String = 'xy';
    fixed: Boolean = false;
    onRelease: EventEmitter<any> = new EventEmitter();
    onSwipe: EventEmitter<any> = new EventEmitter();
    callDestroy: EventEmitter<any>;

    element: HTMLElement;

    constructor(protected el: ElementRef) {
        this.element = el.nativeElement;
    }

    translate(params: any) {
        if (!this.fixed) {
            this.element.style["transition"] = "transform " + (params.time || 0) + "s ease";
            this.element.style["webkitTransform"] = "translate3d(" +
                (params.x && (!this.orientation || this.orientation.indexOf("x") != -1) ? (params.x) : 0) +
                "px, " +
                (params.y && (!this.orientation || this.orientation.indexOf("y") != -1) ? (params.y) : 0) +
                "px, 0) rotate(" +
                params.rotate +
                "deg)";
        }
    }

    onSwipeCb(event: any) {
        let rotate = ((event.deltaX * 20) / this.element.clientWidth);
        this.translate({
            x: event.deltaX,
            y: event.deltaY,
            rotate: rotate
        });
    }

    onReleaseCb(event: any) {
        this.element.style["transition"] = "transform 0.2s ease";
    }

    ngOnInit() {
        var self = this;
        if (this.callDestroy) {
            this.callDestroy.subscribe((delay: number) => {
                this.destroy(delay);
            });
        }
    }

    destroy(delay: number = 0) {
        setTimeout(() => {
            this.element.remove();
        }, 200);
    }

    ngAfterViewChecked() {
        let el = this.element;
        if (this.element.parentElement) {
            el.style['height'] = el.parentElement.clientHeight + 'px';
            el.style['width'] = el.parentElement.clientWidth + 'px';
        }
    }

    @HostListener('pan', ['$event'])
    onPan(event: any) {
        if (!this.fixed) {
            if (this.onSwipeCb) {
                this.onSwipeCb(event);
            }
            if (this.onSwipe) {
                this.onSwipe.emit(event);
            }
        }
    }

    @HostListener('panend', ['$event'])
    onPanEnd(event: any) {
        if (!this.fixed) {
            if (this.onReleaseCb) {
                this.onReleaseCb(event);
            }
            if (this.onRelease) {
                this.onRelease.emit(event);
            }
        }
    }

    ngOnDestroy() {
    }

}
