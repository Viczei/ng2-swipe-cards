import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DragDropService {

  eventEmitter: EventEmitter<any> = new EventEmitter();
  timestamp: number = +new Date;

  constructor() {

  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getEmitterId() {
    let ts = this.timestamp.toString();
    let parts = ts.split("").reverse();
    let id = "";
    for (var i = 0; i < 8; ++i) {
      let index = this._getRandomInt(0, parts.length - 1);
      id += parts[index];
    }
    return id;
  }

  emit(action) {
    this.eventEmitter.emit(action);
  }

  subscribe(callback) {
    this.eventEmitter.subscribe(callback);
  }

}
