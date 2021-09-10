import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { Actions, and, composeWithUi, ControlElement, ControlProps, isControl, RankedTester, rankWith, scopeEndsWith } from '@jsonforms/core';

import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';

@Component({
  selector: 'vex-api-definition-control',
  template: `
    <mat-tab-group dynamicHeight>
      <mat-tab label="Swagger">
        <div #swagger></div>
      </mat-tab>
      <mat-tab label="Editor">
        <div class="my-2 border shadow">
          <div fxLayout="row" fxLayoutGap="8px">
            <button mat-stroked-button>Reset</button>
            <button mat-raised-button color="primary">Save</button>
          </div>
          <ace-editor [(text)]="code" [mode]="'json'" [theme]="'eclipse'" style="min-height: 400px; width:100%; overflow: auto;"></ace-editor>
          <mat-error *ngIf="jsonErrorMessage">{{ jsonErrorMessage }}</mat-error>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [
    `
    ::ng-deep .swagger-ui .info {
      margin: 20px 0;
    }
    `
  ]
})
export class ApiDefinitionControlComponent extends JsonFormsControl implements AfterViewInit {

  apiDef: object;
  jsonErrorMessage: string;
  swaggerUIBundle: SwaggerUIBundle;

  @ViewChild('swagger') swaggerDom: ElementRef<HTMLDivElement>;

  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }

  ngAfterViewInit(): void {
    this.initSwagger();
  }

  initSwagger(): void {
    this.swaggerUIBundle = SwaggerUIBundle({
      domNode: this.swaggerDom.nativeElement,
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
      spec: this.apiDef,
      operationsSorter: 'alpha'
    });
  }

  get code() {
    return JSON.stringify(this.apiDef, null, 2);
  }

  set code(v) {
    try {
      this.apiDef = JSON.parse(v);
      const path = composeWithUi(this.uischema as ControlElement, this.path);
      this.jsonFormsService.updateCore(Actions.update(path, () => JSON.stringify(this.apiDef)));
      this.triggerValidation();
      this.initSwagger();

      this.jsonErrorMessage = null;
    } catch (e) {
      this.jsonErrorMessage = e.message;
    }
  }

  public mapAdditionalProps(props: ControlProps) {
    const property = props.data;
    this.apiDef = (typeof property) === 'string' ? JSON.parse(property) : property;
  }
}

export const apiDefinitionTester: RankedTester = rankWith(5, and(isControl, scopeEndsWith('apiDefinition')));
