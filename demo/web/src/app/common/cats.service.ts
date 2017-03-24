import { Injectable } from '@angular/core';

@Injectable()
export class CatsService {

  cats: any[] = [];

  constructor() {

  }

  getKittenUrl() {
    var w = 500 - Math.floor((Math.random() * 100) + 1);
    var h = 500 - Math.floor((Math.random() * 100) + 1);
    return "http://placekitten.com/" + w + "/" + h;
  }

  get() {
    if (!this.cats.length) {
      for (var i = 0; i < 50; i++) {
        this.cats.push({
          id: i + 1,
          url: this.getKittenUrl()
        })
      }
    }
    return this.cats;
  }

}
