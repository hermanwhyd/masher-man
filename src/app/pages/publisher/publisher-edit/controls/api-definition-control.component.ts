import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { Actions, and, composeWithUi, ControlElement, ControlProps, isControl, RankedTester, rankWith, scopeEndsWith } from '@jsonforms/core';

import icInfo from '@iconify/icons-ic/round-info';

import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';
import { ApiResourceTemplate } from 'src/assets/static-data/template/api-resource';

@Component({
  selector: 'vex-api-definition-control',
  template: `
    <mat-tab-group dynamicHeight>
      <mat-tab label="Swagger">
        <div #swagger></div>
      </mat-tab>
      <mat-tab label="Source">
        <p class="mt-0 py-2 text-secondary">
          Use extenal editor, e.g. <a href="https://editor.swagger.io" target="_blank" class="text-cyan">swagger.io</a>, <a class="text-cyan" href="https://www.apibldr.com" target="_blank">apibldr.com</a>
          or others for better experience while editing Open Api Specification document.
        </p>
        <div class="border shadow">
          <div fxLayout="row" fxLayoutAlign="space-between center" class="p-2">
            <div fxLayout="row" fxLayoutGap="8px">
              <button mat-stroked-button [disabled]='resetable' (click)="discardCode()">Discard</button>
              <button mat-raised-button [disabled]='resetable' (click)="updateCode()" color="primary">Update</button>
            </div>
            <div fxLayout="row" fxLayoutGap="8px" fxLayoutAlign="end center">
              <mat-button-toggle-group [formControl]="methodControl" appearance="legacy">
                <mat-button-toggle value="get">GET</mat-button-toggle>
                <mat-button-toggle value="post">POST</mat-button-toggle>
                <mat-button-toggle value="put">PUT</mat-button-toggle>
                <mat-button-toggle value="patch">PATCH</mat-button-toggle>
                <mat-button-toggle value="delete">DELETE</mat-button-toggle>
              </mat-button-toggle-group>
              <mat-icon class="cursor-pointer" [icIcon]="icInfo" matTooltip="replace path '/*' to selected method default" matTooltipPosition="above"></mat-icon>
            </div>
          </div>
          <!-- <ace-editor [(text)]="code" [mode]="'json'" [theme]="'eclipse'" style="min-height: 400px; width:100%; overflow: auto;"></ace-editor> -->
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

  icInfo = icInfo;

  apiDef: object;
  apiDefOriginal: string;
  jsonErrorMessage: string;
  swaggerUIBundle: SwaggerUIBundle;

  methodControl = new FormControl();

  @ViewChild('swagger') swaggerDom: ElementRef<HTMLDivElement>;

  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }

  ngAfterViewInit(): void {
    this.initSwagger();
    this.methodControl.valueChanges.subscribe((val) => {
      this.code = ApiResourceTemplate[val];
    });
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
    return JSON.stringify(this.apiDef, null, '\t');
  }

  set code(v) {
    try {
      this.apiDef = JSON.parse(v);
      this.jsonErrorMessage = null;
    } catch (e) {
      this.jsonErrorMessage = e.message;
    }
  }

  get resetable(): boolean {
    return JSON.stringify(this.apiDef) === this.apiDefOriginal;
  }

  updateCode() {
    const path = composeWithUi(this.uischema as ControlElement, this.path);
    this.jsonFormsService.updateCore(Actions.update(path, () => JSON.stringify(this.apiDef)));
    this.triggerValidation();
    this.initSwagger();
  }

  discardCode() {
    this.apiDef = JSON.parse(this.apiDefOriginal);
  }

  public mapAdditionalProps(props: ControlProps) {
    const property = props.data;
    this.apiDef = (typeof property) === 'string' ? JSON.parse(property) : property;
    this.apiDefOriginal = JSON.stringify(this.apiDef);
  }
}

export const apiDefinitionTester: RankedTester = rankWith(5, and(isControl, scopeEndsWith('apiDefinition')));
