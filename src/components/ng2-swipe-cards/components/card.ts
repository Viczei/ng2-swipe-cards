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
    styleUrls: [
        './card.css'
    ]
})
export class CardComponent {
    @Input() fixed: Boolean = false;
    @Input() orientation: string = 'xy';
    @Input() callDestroy: EventEmitter<any>;
    releaseRadius: any;

    @Output() onRelease: EventEmitter<any> = new EventEmitter();
    @Output() onSwipe: EventEmitter<any> = new EventEmitter();
    @Output() onAbort: EventEmitter<any> = new EventEmitter();

    element: HTMLElement;

    direction: any = { x: 0, y: 0 };

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
            if (
                (this.orientation == "x" && (this.releaseRadius.x < event.deltaX || this.releaseRadius.x * -1 > event.deltaX)) ||
                (this.orientation == "y" && (this.releaseRadius.y < event.deltaY || this.releaseRadius.y * -1 > event.deltaY)) ||
                ((this.releaseRadius.x < event.deltaX || this.releaseRadius.x * -1 > event.deltaX) ||
                    (this.releaseRadius.y < event.deltaY || this.releaseRadius.y * -1 > event.deltaY))
            ) {
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
