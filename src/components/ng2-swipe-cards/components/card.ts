import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Renderer,
    Input
} from '@angular/core';

@Component({
    template: '<ng-content></ng-content>',
    selector: 'sc-card',
    styleUrls: [
        './card.css'
    ],
    inputs: ['fixed', 'orientation', 'callDestroy'],
    outputs: ['onRelease', 'onAbort', 'onSwipe']
})
export class CardComponent {
    fixed: Boolean = false;
    orientation: string = 'xy';
    callDestroy: EventEmitter<any>;

    onRelease: EventEmitter<any> = new EventEmitter();
    onSwipe: EventEmitter<any> = new EventEmitter();
    onAbort: EventEmitter<any> = new EventEmitter();

    element: HTMLElement;

    direction: any = { x: 0, y: 0 };
    releaseRadius: any;

    constructor(protected el: ElementRef, public renderer: Renderer) {
        this.element = el.nativeElement;
    }

    translate(params: any) {
        if (!this.fixed) {
            this.renderer.setElementStyle(this.element, "transition", "transform " + (params.time || 0) + "s ease");
            this.renderer.setElementStyle(this.element, "webkitTransform", "translate3d(" +
                (params.x && (!this.orientation || this.orientation.indexOf("x") != -1) ? (params.x) : 0) +
                "px, " +
                (params.y && (!this.orientation || this.orientation.indexOf("y") != -1) ? (params.y) : 0) +
                "px, 0) rotate(" + (params.rotate || 0) + "deg)");
        }
    }

    onSwipeCb(event: any) {
        let rotate = ((event.deltaX * 20) / this.element.clientWidth);
        this.direction.x = event.deltaX > 0 ? 1 : -1;
        this.direction.y = event.deltaY > 0 ? 1 : -1;
        this.translate({
            x: event.deltaX,
            y: event.deltaY
        });
    }

    onAbortCb(event: any) {
        this.translate({
            x: 0,
            y: 0,
            rotate: 0,
            time: 0.2
        });
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
        if (this.element.parentElement) {
            this.renderer.setElementStyle(this.element, "height", this.element.parentElement.clientHeight + 'px');
            this.renderer.setElementStyle(this.element, "width", this.element.parentElement.clientWidth + 'px');
        }
    }

    @HostListener('pan', ['$event'])
    onPan(event: any) {
        if (!this.fixed) {
            this.onSwipeCb(event);
            if (this.onSwipe) {
                this.onSwipe.emit(event);
            }
        }
    }

    @HostListener('panend', ['$event'])
    onPanEnd(event: any) {
        if (!this.fixed) {
            if (this.element.clientWidth / 4 < event.deltaX || this.element.clientWidth / 4 * -1 > event.deltaX) {
                if (this.onRelease) {
                    this.onRelease.emit(event);
                }
            } else {
                this.onAbortCb(event);
                if (this.onAbort) {
                    this.onAbort.emit(event);
                }
            }
        }
    }

    ngOnDestroy() {
        if (this.callDestroy) {
            this.callDestroy.unsubscribe();
        }
    }

}
