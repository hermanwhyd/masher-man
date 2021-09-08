import { Component } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';

@Component({
  selector: 'vex-publisher-data-display-component',
  template: '<div class="p-gutter"><ngx-json-viewer [json]="apis"></ngx-json-viewer></div>'
})
export class PublisherDataDisplayComponent extends JsonFormsControl {

  apis: any;

  constructor(service: JsonFormsAngularService) {
    super(service);
  }

  public mapAdditionalProps(props: ControlProps) {
    this.apis = props.data;
  }
}
