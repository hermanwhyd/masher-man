import { Component, ViewChild } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ControlProps } from '@jsonforms/core';

import icGlobe from '@iconify/icons-fa-solid/globe';
import icFile from '@iconify/icons-fa-solid/file-code';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Profile } from 'src/app/types/api-config.interface';
import { ApiDetail } from 'src/app/types/api.interface';
import { PublisherMasterListService } from './services/publisher-master-list.service';
import { MatDialog } from '@angular/material/dialog';
import { MarkdownDialogComponent } from 'src/app/utilities/markdown-dialog/markdown-dialog.component';
import { CurlGenerator } from 'curl-generator';
import { upperCase } from 'lodash';
import * as queryString from 'query-string';

@Component({
  selector: 'vex-publisher-data-display',
  template: `
    <div *ngIf="api?.id" fxFlexLayout="column" fxLayoutAlign="space-between center" fxFlexLayout.gt-sm="row" fxLayoutGap="8px">
      <a mat-stroked-button color="primary" href="{{activeProfile.portalUrl}}/store/apis/info?name={{api.name}}&version={{api.version}}&provider={{api.provider}}" target="_blank">
        <mat-icon [icIcon]="icGlobe" inline="true" size="20px" class="mr-2"></mat-icon>
        STORE
      </a>
      <a mat-stroked-button color="warn" href="{{activeProfile.portalUrl}}/publisher/info?name={{api.name}}&version={{api.version}}&provider={{api.provider}}" target="_blank">
        <mat-icon [icIcon]="icGlobe" inline="true" size="20px" class="mr-2"></mat-icon>
        PUBLISHER
      </a>

      <span fxFlex></span>

      <button *ngIf="!this.isEnabled()" mat-raised-button color="primary" (click)="createDocs()">
        <icon [icIcon]="icFile" [inline]="'true'" size="18px" class="mr-1"></icon> DOCS
      </button>
      <button *ngIf="this.isEnabled()" mat-raised-button color="primary" (click)="createCopy()">MAKE A COPY</button>
    </div>
  `,
  styles: []
})
export class AccountPortalComponent extends JsonFormsControl {
  icGlobe = icGlobe;
  icFile = icFile;

  api: ApiDetail;
  options = new JsonEditorOptions();
  activeProfile: Profile;

  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  constructor(
    jsonFormsAngularService: JsonFormsAngularService,
    private publisherMasterListService: PublisherMasterListService,
    private apiConfigService: ApiConfigService,
    private dialog: MatDialog) {
    super(jsonFormsAngularService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.apiConfigService.profiles$.subscribe(p => {
      this.activeProfile = p.find(f => f.active === true);
    });
  }

  public mapAdditionalProps(props: ControlProps) {
    this.api = props.data;
  }

  public createCopy() {
    this.publisherMasterListService.createEmit.next({ ...this.api, id: null });
  }

  public createDocs() {

    // header
    const apiSpec: any = [
      { h1: this.api.name },
      { p: this.api.description || '' }
    ];

    // contents
    const apiDefinition = JSON.parse(this.api.apiDefinition);

    apiSpec.push({ h2: 'API Reference' });

    for (const [path, methods] of Object.entries(apiDefinition.paths)) {
      for (const [method, value] of Object.entries(methods)) {
        apiSpec.push({ h3: value.summary || 'Default' });
        apiSpec.push({ code: { language: 'typescript', content: `${method} ${path}` } });

        // construct http param and header
        const httpParams: any = {};
        const httpHeaders: any = {
          'Content-type': (!value.consumes) ? 'application/json' : value.consumes.join(', '),
          Authorization: 'bearer {{access_token}}'
        };

        // add parameter
        if (!!value.parameters) {
          const rows = [];
          value.parameters.forEach(p => {
            rows.push([
              p.name || '',
              p.description || '',
              p.in || '',
              p.type || '',
              String(p.required || 'false')
            ]);

            if (p.in === 'query') {
              httpParams[p.name] = p.name;
            }

            if (p.in === 'header') {
              httpHeaders[p.name] = `{{${p.name}}}`;
            }
          });

          apiSpec.push({
            table: {
              headers: ['Parameter Name', 'Description', 'Parameter Type', 'Data Type', 'Required'],
              rows: [...rows]
            }
          });
        }

        // add usage example
        const finalUrl = queryString.stringifyUrl({ url: path === '/*' ? '' : path, query: httpParams });

        const params: any = {
          url: (this.api.endpointURLs[0]?.environmentURLs.https || this.api.endpointURLs[0]?.environmentURLs.https) + finalUrl,
          method: upperCase(method),
          headers: httpHeaders,
          body: null
        };

        const content: any = CurlGenerator(params);

        apiSpec.push({ h4: 'Usage/Example' });
        apiSpec.push({ code: { language: 'typescript', content } });
      }
    }

    // footer
    apiSpec.push({ h2: 'Support' });
    apiSpec.push({ p: 'Please contact our support channel team.' });

    this.dialog.open(MarkdownDialogComponent, {
      data: apiSpec,
      width: '720px'
    });
  }
}
