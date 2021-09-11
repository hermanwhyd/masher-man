import { Component, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'vex-publisher-data-display',
  template: `
    <mat-slide-toggle class="p-6" (change)="togleJsonView($event)" [checked]="isShowJsonRaw" color="primary">Raw JSON</mat-slide-toggle>
    <div class="p-6" *ngIf="isShowJsonRaw">
      <json-editor [options]="options" [data]="apis"></json-editor>
    </div>
    <div class="p-gutter" *ngIf="!isShowJsonRaw"><ngx-json-viewer [json]="apis"></ngx-json-viewer></div>
  `,
  styles: [
    `
      :host ::ng-deep json-editor,
      :host ::ng-deep json-editor .jsoneditor,
      :host ::ng-deep json-editor > div,
      :host ::ng-deep json-editor jsoneditor-outer {
        height: 600px;
      }
    `
  ]
})
export class PublisherDataDisplayComponent extends JsonFormsControl {

  apis: any;
  isShowJsonRaw = false;
  options = new JsonEditorOptions();

  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  constructor(service: JsonFormsAngularService) {
    super(service);

    this.options.mode = 'code';
    this.options.modes = ['code', 'tree'];
  }

  togleJsonView(change: MatSlideToggleChange) {
    this.isShowJsonRaw = change.checked;
  }

  public mapAdditionalProps(props: ControlProps) {
    this.apis = props.data;
  }
}
