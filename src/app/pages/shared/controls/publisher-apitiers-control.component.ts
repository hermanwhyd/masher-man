import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { FormControl } from '@angular/forms';

import jmespath from 'jmespath';
import { Observable } from 'rxjs';
import { Tier } from 'src/app/types/tier.interface';
import { map, startWith } from 'rxjs/operators';
import { TierService } from 'src/app/services/tier.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'vex-publisher-apitiers-control',
  template: `
  <mat-form-field appearance="outline" class="w-full">
    <mat-label>{{ jfProps.label }}</mat-label>
    <mat-chip-list #chipList [formControl]="formControl">
      <mat-chip *ngFor="let tag of tags; let index = index" (removed)="removeTag(index)">
        {{ tag }}
        <mat-icon matChipRemove *ngIf="this.isEnabled()" [icIcon]="icDelete"></mat-icon>
      </mat-chip>
      <input type="text" #tierInput [formControl]="tierCtrl" [matChipInputFor]="chipList" [matAutocomplete]="auto" matChipInputAddOnBlur="'true'" placeholder="type to search" *ngIf="this.isEnabled()">
    </mat-chip-list>
    <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selectedTag($event)">
      <mat-option *ngFor="let item of filteredTiers | async" [value]="item.name">
        <span class="mr-2">{{ item.name }}</span><span class="text-xs text-secondary">{{ item.description }}</span>
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>
  `
})
export class PublisherApiTiersControlComponent extends JsonFormsArrayControl implements OnInit {

  icDelete = icDelete;

  jmespath = jmespath;

  formControl: FormControl = new FormControl([]);
  tierCtrl = new FormControl();
  apiTiers: Tier[] = [];
  filteredTiers: Observable<Tier[]>;

  currentTags: string[] = [];

  jfState: JsonFormsState;
  jfProps: StatePropsOfArrayLayout;

  private addItem: (path: string, value: any) => () => void;
  private removeItems: (path: string, toDelete: number[]) => () => void;

  @ViewChild('tierInput') tierInput: ElementRef<HTMLInputElement>;
  constructor(
    jsonFormsService: JsonFormsAngularService,
    private tierService: TierService
  ) {
    super(jsonFormsService);

    this.filteredTiers = this.tierCtrl.valueChanges.pipe(
      startWith(null),
      map((keyword: string | null) => this._filterTier(keyword))
    );
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

    this.currentTags = jmespath.search(state.jsonforms?.core?.data, path) || [];
    this.formControl.patchValue(this.currentTags);

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
      this.formControl.disable();
    } else {
      this.tierService.apiTiers().subscribe(data => {
        this.apiTiers = data.list;
        this.tierCtrl.setValue('');
      });
    }
  }

  get tags() {
    return this.formControl.value;
  }

  trackByFn(index: number) {
    return index;
  }

  removeTag(index: number): void {
    this.remove(index);
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    this.add(event.option.value);
    this.tierInput.nativeElement.value = '';
    this.tierCtrl.setValue(null);
  }

  private _filterTier(value: string): Tier[] {
    const filterValue = (value || '').trim().toLowerCase();
    return this.apiTiers?.filter(t => t.name?.toLowerCase().includes(filterValue) && !this.currentTags.includes(t.name));
  }

}

export const apiTiersTester: Tester = or(
  and(
    schemaTypeIs('array'),
    scopeEndsWith('tiers')
  )
);
