import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { JsonFormsAngularService, JsonFormsArrayControl } from '@jsonforms/angular';
import {
  and,
  JsonFormsState,
  mapStateToArrayLayoutProps,
  or,
  schemaTypeIs,
  scopeEndsWith,
  StatePropsOfArrayLayout,
  Tester
} from '@jsonforms/core';

import jmespath from 'jmespath';

@Component({
  selector: 'vex-publisher-array-control',
  template: `
  <form [formGroup]="formx">
    <mat-form-field appearance="outline" class="w-full" autocomplete="off">
      <mat-label>Http</mat-label>
      <input formControlName="http" matInput>
    </mat-form-field>

    <mat-form-field appearance="outline" class="w-full" autocomplete="off">
      <mat-label>Https</mat-label>
      <input formControlName="https" matInput>
    </mat-form-field>
  </form>
  `
})
export class PublisherEndpointUrlControlComponent extends JsonFormsArrayControl {

  jmespath = jmespath;

  jfState: JsonFormsState;
  jfProps: StatePropsOfArrayLayout;

  formx = this.fb.group({
    http: { value: '', disabled: !this.isEnabled() },
    https: { value: '', disabled: !this.isEnabled() }
  });

  constructor(
    jsonFormsService: JsonFormsAngularService,
    private fb: FormBuilder) {
    super(jsonFormsService);
  }

  mapToProps(state: JsonFormsState): StatePropsOfArrayLayout {
    this.jfState = state;
    const props = mapStateToArrayLayoutProps(state, this.getOwnProps());
    this.jfProps = props;

    this.formx.patchValue({
      http: this.jmespath.search(state.jsonforms?.core?.data, 'endpointURLs[0].environmentURLs.http'),
      https: this.jmespath.search(state.jsonforms?.core?.data, 'endpointURLs[0].environmentURLs.https')
    });

    return { ...props };
  }

}

export const arrayEndpointUrlTester: Tester = or(
  and(
    schemaTypeIs('array'),
    scopeEndsWith('endpointURLs')
  )
);
