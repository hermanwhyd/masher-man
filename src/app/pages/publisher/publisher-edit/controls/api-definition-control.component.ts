import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { Actions, and, composeWithUi, ControlElement, ControlProps, isControl, RankedTester, rankWith, scopeEndsWith } from '@jsonforms/core';

import icInfo from '@iconify/icons-ic/round-info';

import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';
import { ApiResourceTemplate } from 'src/assets/static-data/template/api-resource';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { MatDialog } from '@angular/material/dialog';
import { InformationDialogComponent } from 'src/app/utilities/information-dialog/information-dialog.component';
import { apiSpecificationExample } from 'src/assets/static-data/template/api-specification';

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
              <button mat-raised-button (click)="updateCode()" color="primary">Apply Changes</button>
            </div>
            <div fxLayout="row" fxLayoutGap="8px" fxLayoutAlign="end center">
              <mat-button-toggle-group [formControl]="methodControl" appearance="legacy">
                <mat-button-toggle value="reset" class="text-teal">RESET</mat-button-toggle>
                <mat-button-toggle value="get" >GET</mat-button-toggle>
                <mat-button-toggle value="post">POST</mat-button-toggle>
                <mat-button-toggle value="put">PUT</mat-button-toggle>
                <mat-button-toggle value="patch">PATCH</mat-button-toggle>
                <mat-button-toggle value="delete">DELETE</mat-button-toggle>
              </mat-button-toggle-group>
              <mat-icon class="cursor-pointer" [icIcon]="icInfo" matTooltip="replace path '/*' to selected method default" matTooltipPosition="above"></mat-icon>
            </div>
          </div>
          <json-editor [options]="options" [data]="apiDef"></json-editor>
        </div>
        <div class="text-secondary caption py-2">If you need a inspiration, here is an <a (click)="showExample()" class="text-teal cursor-pointer">example</a></div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [
    `
      ::ng-deep .swagger-ui .info {
        margin: 20px 0;
      }

      ::ng-deep .swagger-ui .wrapper {
        padding: 0;
      }

      :host ::ng-deep json-editor,
      :host ::ng-deep json-editor .jsoneditor,
      :host ::ng-deep json-editor > div,
      :host ::ng-deep json-editor jsoneditor-outer {
        height: 500px;
      }
    `
  ]
})
export class ApiDefinitionControlComponent extends JsonFormsControl implements AfterViewInit {

  icInfo = icInfo;

  apiDef: any;
  apiDefOriginal: string;
  swaggerUIBundle: SwaggerUIBundle;

  methodControl = new FormControl();
  options = new JsonEditorOptions();

  @ViewChild('swagger') swaggerDom: ElementRef<HTMLDivElement>;
  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  constructor(
    private jsonformsService: JsonFormsAngularService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {
    super(jsonformsService);

    this.options.mode = 'code';
    this.options.modes = ['code', 'tree'];
    this.options.statusBar = false;
  }

  ngAfterViewInit(): void {
    this.initSwagger();
    this.methodControl.valueChanges.subscribe((val) => {
      // if reset
      if (val === 'reset') {
        this.resetCode();
        return;
      }

      const resource: any = this.editor.get();
      resource.paths['/*'] = { [val]: ApiResourceTemplate[val] };
      this.editor.set(resource);
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

  resetCode() {
    this.editor.data = JSON.parse(this.apiDefOriginal);
  }

  updateCode() {
    const path = composeWithUi(this.uischema as ControlElement, this.path);
    this.jsonFormsService.updateCore(Actions.update(path, () => JSON.stringify(this.editor?.get())));
    this.triggerValidation();
    this.initSwagger();

    this.snackBar.openFromComponent(SnackbarNotifComponent, {
      data: { message: 'Changes applied', type: 'success' },
      duration: 5000
    });
  }

  showExample() {
    this.dialog.open(InformationDialogComponent, {
      data: {
        message: `<pre>${JSON.stringify(apiSpecificationExample, null, 2)}</pre>`,
        buttonText: {
          cancel: 'Close'
        }
      }
    });
  }

  public mapAdditionalProps(props: ControlProps) {
    const property = props.data;
    this.apiDef = (typeof property) === 'string' ? JSON.parse(property) : property;
    this.apiDefOriginal = JSON.stringify(this.apiDef);
  }
}

export const apiDefinitionTester: RankedTester = rankWith(5, and(isControl, scopeEndsWith('apiDefinition')));
