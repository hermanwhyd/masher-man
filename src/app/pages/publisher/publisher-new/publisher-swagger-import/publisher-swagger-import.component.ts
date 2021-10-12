import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiDetail } from 'src/app/types/api.interface';

import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icClose from '@iconify/icons-ic/twotone-close';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icClear from '@iconify/icons-ic/baseline-clear';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SPACE, FF_SEMICOLON } from '@angular/cdk/keycodes';
import { paramCase, pascalCase } from 'change-case';
import _, { lowerCase, upperCase, upperFirst } from 'lodash';

import { ApiDetailTemplate } from 'src/assets/static-data/template/api-detail';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'vex-publisher-swagger-import',
  templateUrl: './publisher-swagger-import.component.html',
  styleUrls: ['./publisher-swagger-import.component.scss']
})
export class PublisherSwaggerImportComponent implements OnInit {

  icDoneAll = icDoneAll;
  icClose = icClose;
  icDelete = icDelete;
  icClear = icClear;

  swagger: any;
  isOpenApi: boolean;

  readonly separatorKeysCodes = [ENTER, COMMA, SPACE, FF_SEMICOLON] as const;

  form = this.fb.group({
    name: ['', Validators.required],
    context: ['', Validators.required],
    version: ['', Validators.required],
    description: [''],
    server: [''],
    tags: [[]],
  });

  form2nd = this.fb.group({
    businessOwner: [''],
    businessOwnerEmail: [''],
    technicalOwner: ['', Validators.required],
    technicalOwnerEmail: [''],
  });

  @ViewChild('stepper') private myStepper: MatStepper;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<PublisherSwaggerImportComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.swagger = this.data;
    this.isOpenApi = this.data.swagger === undefined;

    const host = this.isOpenApi ? this.swagger.servers[0].url : 'http://' + this.swagger.host;
    const title = this.isOpenApi ? this.swagger.info?.title : this.swagger.host?.split('.')[0];

    this.formControl.name.setValue(pascalCase(title) + '-v1');
    this.formControl.context.setValue(paramCase(title) + '/{version}');
    this.formControl.version.setValue('v1');

    this.formControl.server.setValue(host);
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  get formControl2nd() {
    return this.form2nd.controls;
  }

  get tags() {
    return this.form.get('tags');
  }

  get nextable(): boolean {
    return this.form.valid;
  }

  get nextable2nd(): boolean {
    return this.form2nd.valid;
  }

  removeTag(tag: string): void {
    const index = this.tags.value.indexOf(tag);

    if (index >= 0) {
      this.tags.value.splice(index, 1);
      this.tags.updateValueAndValidity();
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.value.push(paramCase(value));
      this.tags.updateValueAndValidity();
    }

    // Clear the input value
    event.chipInput.clear();
  }

  goForward() {
    this.myStepper.next();
  }

  submit() {
    const form = this.form.getRawValue();
    const form2nd = this.form2nd.getRawValue();

    const draftAPIs = [] as ApiDetail[];

    Object.entries(this.swagger.paths).forEach(([path, pvalue]) => {
      Object.entries(pvalue).filter(([fkey, fvalue]) => fvalue.selected === true).forEach(([method, spec]) => {
        spec['x-auth-type'] = 'Application & Application User';
        spec['x-throttling-tier'] = 'Unlimited';

        delete (spec.selected);

        const apiName = `${form.name}-${upperFirst(method)}${pascalCase(path.split('/').pop())}`;
        const apiContext = `${form.context}/${lowerCase(method)}-${paramCase(path.split('/').pop())}`;

        const apiDefinitionSwagger = {
          openapi: this.swagger.openapi,
          ...{ paths: this.swagger.paths },
          ...{ paths: { ['/*']: { [`${method}`]: spec } } }
        };

        let allowedHeaders = [];
        if (spec.parameters) {
          allowedHeaders = spec.parameters.filter(p => p.in === 'header').map(p => p.name);
        }

        const server = form.server;

        const api: Partial<ApiDetail> = {
          name: apiName,
          context: apiContext,
          version: form.version,
          description: [form.description, spec.description].join(' ').trim(),
          tags: form.tags,
          endpointConfig: {
            production_endpoints: {
              url: [server, path].join(''),
              config: null,
              template_not_supported: false
            },
            sandbox_endpoints: {
              url: '',
              config: null,
              template_not_supported: false
            },
            endpoint_type: 'http'
          },
          apiDefinition: apiDefinitionSwagger,
          businessInformation: form2nd,
          corsConfiguration: {
            corsConfigurationEnabled: true,
            accessControlAllowOrigins: [
              '*'
            ],
            accessControlAllowCredentials: true,
            accessControlAllowHeaders: [
              'authorization',
              'Access-Control-Allow-Origin',
              'Content-Type',
              ...allowedHeaders
            ],
            accessControlAllowMethods: ['OPTIONS', upperCase(method)]
          }
        };

        draftAPIs.push({ ...ApiDetailTemplate, ...api });
      });
    });

    this.dialogRef.close(draftAPIs);
  }
}
