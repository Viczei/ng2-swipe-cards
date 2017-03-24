import { Injectable } from '@angular/core';

@Injectable()
export class CatsService {

  cats: any[] = [];

  constructor() {

  }

  public get() {
    if (!this.cats.length) {
      for (let i = 0; i < 50; i++) {
        this.cats.push({
          id: i + 1,
          url: this.getKittenUrl()
        })
      }
    }
    return this.cats;
  }

  private getKittenUrl() {
    let w = 500 - Math.floor((Math.random() * 100) + 1);
    let h = 500 - Math.floor((Math.random() * 100) + 1);
    return "http://placekitten.com/" + w + '/' + h;
  }
}
