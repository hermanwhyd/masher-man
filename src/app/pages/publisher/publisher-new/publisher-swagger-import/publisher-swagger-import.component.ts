import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Api, ApiDetail } from 'src/app/types/api.interface';

import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icClose from '@iconify/icons-ic/twotone-close';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icClear from '@iconify/icons-ic/baseline-clear';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SPACE, FF_SEMICOLON } from '@angular/cdk/keycodes';
import { paramCase, pascalCase } from 'change-case';
import _, { lowerCase, upperCase, upperFirst } from 'lodash';

import { ApiDetailTemplate } from 'src/assets/static-data/api-detail';

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

  readonly separatorKeysCodes = [ENTER, COMMA, SPACE, FF_SEMICOLON] as const;

  form = this.fb.group({
    name: ['', Validators.required],
    context: ['', Validators.required],
    version: ['', Validators.required],
    description: [''],
    tags: [[]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<PublisherSwaggerImportComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.swagger = this.data;

    Object.values(this.swagger.paths).forEach(paths => {
      Object.values(paths).forEach((method: any) => method.selected = true);
    });

    this.formControl.name.setValue(pascalCase(this.swagger.info?.title) + '-v1');
    this.formControl.context.setValue(paramCase(this.swagger.info?.title) + '/{version}');
    this.formControl.version.setValue('v1');
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  get tags() {
    return this.form.get('tags');
  }

  get nextable(): boolean {
    return this.form.valid;
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

  submit() {
    const form = this.form.getRawValue();

    const draftAPIs = [] as ApiDetail[];

    Object.entries(this.swagger.paths).forEach(([path, pvalue]) => {
      Object.entries(pvalue).filter(([fkey, fvalue]) => fvalue.selected === true).forEach(([method, spec]) => {
        spec['x-auth-type'] = 'Application & Application User';
        spec['x-throttling-tier'] = 'Unlimited';

        const apiName = `${form.name}-${upperFirst(method)}${pascalCase(path.split('/').pop())}`;
        const apiContext = `${form.context}/${lowerCase(method)}${paramCase(path.split('/').pop())}`;

        const apiDefinitionSwagger = {
          ...this.swagger, ... { info: { title: apiName }, paths: { ['/*']: { [`${method}`]: spec } } }
        };

        const api: ApiDetail = {
          name: apiName,
          context: apiContext,
          version: form.version,
          provider: 'developer',
          tiers: ['Default', 'Unlimited'],
          isDefaultVersion: false,
          thumbnailUri: '',
          wsdlUri: '',
          transport: ['http', 'https'],
          endpointConfig: {
            production_endpoints: {
              url: (this.swagger.servers[0]?.url || this.swagger.host) + path,
              config: null,
              template_not_supported: false
            },
            sandbox_endpoints: {
              url: null,
              config: null,
              template_not_supported: false
            },
            endpoint_type: 'http'
          },
          visibility: 'PUBLIC',
          type: 'HTTP',
          apiLevelPolicy: null,
          authorizationHeader: null,
          maxTps: null,
          visibleRoles: [],
          visibleTenants: [],
          description: form.description,
          apiDefinition: apiDefinitionSwagger,
          status: 'CREATED',
          responseCaching: 'Disabled',
          cacheTimeout: 300,
          destinationStatsEnabled: 'ENDPOINT',
          endpointSecurity: null,
          tags: form.tags,
          gatewayEnvironments: 'Production and Sandbox',
          labels: [],
          sequences: [],
          subscriptionAvailability: null,
          subscriptionAvailableTenants: [],
          additionalProperties: {},
          accessControl: 'NONE',
          accessControlRoles: [],
          businessInformation: {
            businessOwner: null,
            businessOwnerEmail: null,
            technicalOwner: null,
            technicalOwnerEmail: null
          },
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
              ...spec.parameters.filter(p => p.in === 'header').map(p => p.name)
            ],
            accessControlAllowMethods: ['OPTIONS', upperCase(method)]
          }
        };

        draftAPIs.push(api);
      });
    });

    this.dialogRef.close(draftAPIs);
  }
}
