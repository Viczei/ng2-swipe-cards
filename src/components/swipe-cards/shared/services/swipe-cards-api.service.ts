import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()

export class SwipeCardsApi {

  private swipeAction: Subject<any> = new Subject();

  public swipeAction$: Observable<any> = this.swipeAction.asObservable();

  constructor() {}

  swipe(options: any): void {
    this.swipeAction.next(options);
  }
}
