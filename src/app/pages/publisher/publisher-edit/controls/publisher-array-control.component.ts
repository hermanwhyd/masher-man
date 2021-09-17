import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA, SPACE, FF_SEMICOLON } from '@angular/cdk/keycodes';

import icDelete from '@iconify/icons-ic/twotone-delete';

import { JsonFormsAngularService, JsonFormsArrayControl } from '@jsonforms/angular';
import {
  and,
  JsonFormsState,
  mapDispatchToArrayControlProps,
  mapStateToArrayLayoutProps,
  or,
  schemaTypeIs,
  scopeEndsWith,
  StatePropsOfArrayLayout,
  Tester
} from '@jsonforms/core';
import { FormBuilder } from '@angular/forms';

import jmespath from 'jmespath';

@Component({
  selector: 'vex-publisher-array-control',
  template: `
    <form [formGroup]="formx">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>{{ jfProps.label }}</mat-label>
        <mat-chip-list #chipList formControlName="tags">
          <mat-chip *ngFor="let tag of tags.value; let index = index" (removed)="removeTag(index)">
            {{ tag }}
            <mat-icon matChipRemove *ngIf="this.isEnabled()" [icIcon]="icDelete"></mat-icon>
          </mat-chip>
          <input type="text" [matChipInputFor]="chipList" matChipInputAddOnBlur="'true'" [matChipInputSeparatorKeyCodes]="separatorKeysCodes" (matChipInputTokenEnd)="addTag($event)">
        </mat-chip-list>
      </mat-form-field>
    </form>
  `
})
export class PublisherArrayControlComponent extends JsonFormsArrayControl implements OnInit {

  icDelete = icDelete;

  jmespath = jmespath;

  formx = this.fb.group({
    tags: [[]]
  });

  jfState: JsonFormsState;
  jfProps: StatePropsOfArrayLayout;

  readonly separatorKeysCodes = [ENTER, COMMA, SPACE, FF_SEMICOLON] as const;

  private addItem: (path: string, value: any) => () => void;
  private removeItems: (path: string, toDelete: number[]) => () => void;

  constructor(jsonFormsService: JsonFormsAngularService, private fb: FormBuilder) {
    super(jsonFormsService);
  }

  remove(index: number): void {
    this.removeItems(this.propsPath, [index])();
  }

  add(value: string): void {
    this.addItem(this.propsPath, value)();
  }

  mapToProps(state: JsonFormsState): StatePropsOfArrayLayout {
    this.jfState = state;
    const props = mapStateToArrayLayoutProps(state, this.getOwnProps());
    this.jfProps = props;

    const path = props.path.startsWith('apis.')
      ? props.path.replace('apis.', 'apis[').replace(/\./, '].') // replace apis.#n. to apis[#n].
      : props.path;

    const currentValues = jmespath.search(state.jsonforms?.core?.data, path);
    this.formx.patchValue({ tags: currentValues || [] });

    return { ...props };
  }

  ngOnInit(): void {
    super.ngOnInit();

    const { addItem, removeItems } = mapDispatchToArrayControlProps(
      this.jsonFormsService.updateCore.bind(this.jsonFormsService)
    );

    this.addItem = addItem;
    this.removeItems = removeItems;

    if (!this.isEnabled()) {
      this.formx.get('tags').disable();
    }
  }

  get tags() {
    return this.formx.get('tags');
  }

  trackByFn(index: number) {
    return index;
  }

  removeTag(index: number): void {
    this.remove(index);
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.add(value);
    }

    // Clear the input value
    event.chipInput.clear();
  }
}

export const arrayPrimitiveTester: Tester = or(
  and(
    schemaTypeIs('array'),
    scopeEndsWith('accessControlAllowMethods')
  ),
  and(
    schemaTypeIs('array'),
    scopeEndsWith('accessControlAllowHeaders')
  ),
  and(
    schemaTypeIs('array'),
    scopeEndsWith('tags')
  )
);
