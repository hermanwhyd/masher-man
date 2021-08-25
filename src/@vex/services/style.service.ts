import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

export enum Style {
  light = 'vex-style-light',
  default = 'vex-style-default',
  dark = 'vex-style-dark'
}

const STORAGE_KEY = 'MasherMan-StyleConf';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class StyleService {

  defaultStyle = Style.default;

  private _styleSubject = new BehaviorSubject<Style>(this.storage.get(STORAGE_KEY) || this.defaultStyle);
  style$ = this._styleSubject.asObservable();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCAL_STORAGE) private storage: StorageService) {
    this.style$.pipe(untilDestroyed(this)).subscribe(style => this._updateStyle(style));
  }

  setStyle(style: Style) {
    this.storage.set(STORAGE_KEY, style);
    this._styleSubject.next(style);
  }

  private _updateStyle(style: Style) {
    const body = this.document.body;

    Object.values(Style).filter(s => s !== style).forEach(value => {
      if (body.classList.contains(value)) {
        body.classList.remove(value);
      }
    });

    body.classList.add(style);
  }
}
