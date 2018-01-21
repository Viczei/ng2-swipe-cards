import {Directive, Input, HostListener} from '@angular/core';

import {SwipeCardsApi} from '@components/swipe-cards/shared/services/swipe-cards-api.service';

@Directive({
  selector: '[swipeCardsAction]'
})

export class ActionDirective {
  @Input() action: string;
  @Input() direction: string;
  @Input() beforeSwipeAction: () => boolean;

  constructor(private swipeCardsApi: SwipeCardsApi) {}

  @HostListener('click')
  swipeCard(): void {

    this.swipeCardsApi.swipe({
      action: this.action,
      beforeSwipeAction: this.beforeSwipeAction,
      direction: this.direction
    });
  }
}
