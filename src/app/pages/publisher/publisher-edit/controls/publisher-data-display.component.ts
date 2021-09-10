import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';

@Component({
  selector: 'vex-publisher-data-display',
  template: `
    <mat-slide-toggle class="p-6" (change)="togleJsonView($event)" [checked]="isShowJsonRaw" color="primary">Raw JSON</mat-slide-toggle>
    <div class="p-6" *ngIf="isShowJsonRaw">
      <!-- <ace-editor [(text)]="code" [mode]="'json'" [theme]="'eclipse'" [readOnly]="true" style="min-height: 600px; width:100%; overflow: auto;"></ace-editor> -->
    </div>
    <div class="p-gutter" *ngIf="!isShowJsonRaw"><ngx-json-viewer [json]="apis"></ngx-json-viewer></div>
  `
})
export class PublisherDataDisplayComponent extends JsonFormsControl {

  apis: any;
  isShowJsonRaw = false;

  constructor(service: JsonFormsAngularService) {
    super(service);
  }

  togleJsonView(change: MatSlideToggleChange) {
    this.isShowJsonRaw = change.checked;
  }

  get code() {
    return JSON.stringify(this.apis, null, '\t');
  }

  set code(v) {
    try {
      this.data = JSON.parse(v);
    }
    catch (e) {
      console.log('error occored while you were typing the JSON');
    }
  }

  public mapAdditionalProps(props: ControlProps) {
    this.apis = props.data;
  }
}
