import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'swipe-cards',
  templateUrl: './swipe-cards.component.html',
  styleUrls: ['./swipe-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SwipeCardsComponent implements OnInit {
  @ContentChild('cardRef', {read: TemplateRef}) cardRef: TemplateRef<any>;
  @ContentChild('controlsRef', {read: TemplateRef}) controlsRef: TemplateRef<any>;
  @Input() beforeSwipeAction: (event: any) => any;
  @Input() cards: any[] = [];

  @Input() set config(config) {

    if (config) {
      this._config = config;
    }
  }

  get config() {
    return this._config;
  }

  @Output() liked: EventEmitter<any> = new EventEmitter<any>();
  @Output() disliked: EventEmitter<any> = new EventEmitter<any>();
  @Output() swiped: EventEmitter<any> = new EventEmitter<any>();
  @Output() aborted: EventEmitter<any> = new EventEmitter<any>();
  @Output() disallowed: EventEmitter<any> = new EventEmitter<any>();
  @Output() special: EventEmitter<any> = new EventEmitter<any>();

  private _config: any = {
    orientation: 'x',
    fixed: false,
    overlay: {
      like: {
        backgroundColor: '#28e93b'
      },
      dislike: {
        backgroundColor: '#e92828'
      },
      special: {
        backgroundColor: '#ffde39'
      }
    }
  };

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  onLike(event: any): void {
    console.log('liked', event)
    this.liked.emit(event);
  }

  onDislike(event: any): void {
    console.log('disliked', event)
    this.disliked.emit(event);
  }

  onSwipe(event: any): void {
    // console.log('swiped', event)
    this.swiped.emit(event);
  }

  onAbort(event: any): void {
    console.log('aborted', event)
    this.aborted.emit(event);
  }

  onDisallowed(event: any): void {
    this.disallowed.emit(event);
  }

  onSpecial(event: any): void {
    this.special.emit(event);
  }

  removeCard(event: any, i: number): void {

    // setTimeout(() => {
      this.cards.splice(i, 1);
      this.cd.markForCheck();
    // }, 800);
  }

  trackByFn(i, item): number {
    return item._id;
  }
}
