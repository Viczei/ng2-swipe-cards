import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DragDropService {

  eventStore: any = {};

  constructor() {
  }

  emit(type, payload) {
    this.eventStore[type] = this.eventStore[type] || new EventEmitter();
    this.eventStore[type].emit(payload);
  }

  subscribe(type, callback) {
    this.eventStore[type] = this.eventStore[type] || new EventEmitter();
    this.eventStore[type].subscribe(callback);
  }

}
