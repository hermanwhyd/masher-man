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

import * as Converter from 'api-spec-converter';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'vex-api-definition-control',
  template: `
    <mat-tab-group dynamicHeight>
      <mat-tab label="Swagger">
        <div #swagger></div>
      </mat-tab>
      <mat-tab label="Editor" [disabled]="!this.isEnabled()">
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
                <mat-button-toggle value="get" class="text-cyan">GET</mat-button-toggle>
                <mat-button-toggle value="post" class="text-cyan">POST</mat-button-toggle>
                <mat-button-toggle value="put" class="text-cyan">PUT</mat-button-toggle>
                <mat-button-toggle value="patch" class="text-cyan">PATCH</mat-button-toggle>
                <mat-button-toggle value="delete" class="text-cyan">DELETE</mat-button-toggle>
              </mat-button-toggle-group>
              <mat-icon class="cursor-pointer" [icIcon]="icInfo" matTooltip="replace path '/*' to selected method default" matTooltipPosition="above"></mat-icon>
            </div>
          </div>
          <json-editor [options]="options" [data]="apiDef"></json-editor>
        </div>
        <div class="text-secondary caption py-2">After making any changes, don't forget to click Apply Changes button. For inspiration, here is an <a (click)="showExample()" class="text-teal cursor-pointer">example</a>.</div>
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
    this.methodControl.valueChanges.subscribe((val: any) => {
      // if reset
      if (val === 'reset') {
        this.resetCode();
        return;
      }

      let resource: any = this.editor.get();

      if (resource.swagger) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: `
            To add or override a default operation, API specifications will be converted to OpenApi3 first.
            </br>This action will not break any API specifications and as long as the changes have not been applied you can reset it.
            <span class="mt-2 block">Here to see the difference <a href="https://www.google.com/search?q=swagger+vs+openapi" target="_blank" class="text-teal underline">swagger vs openapi</a>.<span>
            `,
            buttonText: {
              ok: 'Continue',
              cancel: 'Cancel'
            }
          }
        });

        dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
          if (confirmed) {
            const converted: any = await Converter.convert({ from: 'swagger_2', to: 'openapi_3', source: resource });
            resource = JSON.parse(JSON.stringify(converted.spec));
            resource.paths['/*'] = { [val]: ApiResourceTemplate[val] };
            this.editor.set(resource);
          }
        });
      } else {
        resource.paths['/*'] = { [val]: ApiResourceTemplate[val] };
        this.editor.set(resource);
      }
    });
  }

  initSwagger(): void {
    this.swaggerUIBundle = SwaggerUIBundle({
      domNode: this.swaggerDom.nativeElement,
      deepLinking: false,
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
