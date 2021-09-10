import some from 'lodash/some';
import get from 'lodash/get';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import {
  JsonFormsAngularService,
  JsonFormsArrayControl
} from '@jsonforms/angular';
import {
  ArrayControlProps,
  ControlElement,
  findUISchema,
  getFirstPrimitiveProp,
  JsonFormsState,
  mapDispatchToArrayControlProps,
  mapStateToArrayControlProps,
  RankedTester,
  rankWith,
  StatePropsOfArrayControl,
  uiTypeIs
} from '@jsonforms/core';
import { ApiDetailTemplate } from 'src/assets/static-data/template/api-detail';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

const keywords = ['#', 'properties', 'items'];

export const removeSchemaKeywords = (path: string) => {
  return path
    .split('/')
    .filter(s => !some(keywords, key => key === s))
    .join('.');
};

@Component({
  selector: 'vex-publisher-list-control-controller',
  template: `
    <mat-sidenav-container [fxHide]="hidden">
      <mat-sidenav mode="side" class="p-2" opened>
        <mat-nav-list>
          <mat-list-item *ngIf="masterItems.length === 0">No items</mat-list-item>
          <mat-list-item
            *ngFor="let item of masterItems;let i = index;trackBy: trackElement"
            [class.selected]="item === selectedItem"
            (click)="onSelect(item, i)"
            (mouseover)="onListItemHover(i)"
            (mouseout)="onListItemHover(undefined)"
          >
            <a matLine [matTooltip]="item.label" matTooltipPosition="above">{{ item.label || 'No label set' }}</a>
            <button
              mat-icon-button
              class="button hide"
              (click)="onDeleteClick(i)"
              [ngClass]="{ show: highlightedIdx == i }"
              *ngIf="isEnabled()"
            >
              <mat-icon mat-list-icon>delete</mat-icon>
            </button>
          </mat-list-item>
        </mat-nav-list>
        <button
          mat-fab
          color="primary"
          class="add-button"
          (click)="onAddClick()"
          *ngIf="isEnabled()"
        >
          <mat-icon aria-label="Add item to list">add</mat-icon>
        </button>
      </mat-sidenav>
      <mat-sidenav-content class="content">
        <vex-jsonforms-detail *ngIf="selectedItem" [item]="selectedItem" ></vex-jsonforms-detail>
        <vex-jsonform-empty *ngIf="!selectedItem"></vex-jsonform-empty>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      mat-list-item.selected {
        background: rgba(0, 0, 0, 0.04);
      }
      .container {
        height: 100vh;
      }
      .content {
        padding: 15px;
        background-color: #fff;
      }
      .add-button {
        float: right;
        margin-top: 0.5em;
        margin-right: 0.25em;
      }
      .button {
        float: right;
        margin-right: 0.25em;
      }
      .hide {
        display: none;
      }
      .show {
        display: inline-block;
      }
      mat-sidenav {
        width: 20%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterListComponent extends JsonFormsArrayControl {
  masterItems: any[];
  selectedItem: any;
  selectedItemIdx: number;
  addItem: (path: string, value: any) => () => void;
  removeItems: (path: string, toDelete: number[]) => () => void;
  propsPath: string;
  highlightedIdx: number;

  constructor(
    jsonformsService: JsonFormsAngularService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog) {
    super(jsonformsService);
  }

  onListItemHover(idx: number) {
    this.highlightedIdx = idx;
  }

  trackElement(_index: number, element: any) {
    return element ? element.label : null;
  }

  ngOnInit() {
    super.ngOnInit();
    const dispatch = this.jsonFormsService.updateCore.bind(this.jsonFormsService);
    const { addItem, removeItems } = mapDispatchToArrayControlProps(dispatch);
    this.addItem = addItem;
    this.removeItems = removeItems;
  }

  mapAdditionalProps(props: ArrayControlProps) {
    const { data, path, schema, uischema } = props;
    const controlElement = uischema as ControlElement;
    this.propsPath = props.path;
    const detailUISchema = findUISchema(
      props.uischemas,
      schema,
      `${controlElement.scope}/items`,
      props.path,
      'VerticalLayout',
      controlElement
    );

    const masterItems = (data || []).map((d: any, index: number) => {
      const labelRefInstancePath = controlElement.options?.labelRef && removeSchemaKeywords(
        controlElement.options.labelRef
      );
      const isPrimitive = d !== undefined && typeof d !== 'object';
      const masterItem = {
        label: isPrimitive ? d.toString() : get(d, labelRefInstancePath ?? getFirstPrimitiveProp(schema)),
        data: d,
        path: `${path}.${index}`,
        schema,
        uischema: detailUISchema
      };
      return masterItem;
    });
    this.masterItems = masterItems;
    let newSelectedIdx = -1;
    let newSelectedItem;
    if (this.masterItems.length === 0) {
      // unset select if no elements anymore
      this.selectedItem = undefined;
      this.selectedItemIdx = -1;
    } else if (this.selectedItemIdx >= this.masterItems.length) {
      // the previous index is to high, reduce it to the maximal possible
      newSelectedIdx = this.masterItems.length - 1;
      newSelectedItem = this.masterItems[newSelectedIdx];
    } else if (
      this.selectedItemIdx !== -1 &&
      this.selectedItemIdx < this.masterItems.length
    ) {
      newSelectedIdx = this.selectedItemIdx;
      newSelectedItem = this.masterItems[this.selectedItemIdx];
    }

    if (
      newSelectedItem !== undefined &&
      this.selectedItem !== undefined &&
      (newSelectedItem.label === this.selectedItem.label ||
        newSelectedItem.path === this.selectedItem.path)
    ) {
      // after checking that we are on the same path, set selection
      this.selectedItem = newSelectedItem;
      this.selectedItemIdx = newSelectedIdx;
    } else if (this.masterItems.length > 0) {
      // pre-select 1st entry if the previous selected element as fallback
      this.selectedItem = this.masterItems[0];
      this.selectedItemIdx = 0;
    }
    this.changeDetectorRef.markForCheck();
  }

  onSelect(item: any, idx: number): void {
    this.selectedItem = item;
    this.selectedItemIdx = idx;
  }

  onAddClick() {
    this.addItem(this.propsPath, ApiDetailTemplate)();
  }

  onDeleteClick(item: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete the selected entry?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.removeItems(this.propsPath, [item])();
      }
    });
  }

  protected mapToProps(state: JsonFormsState): StatePropsOfArrayControl {
    const props = mapStateToArrayControlProps(state, this.getOwnProps());
    return { ...props };
  }
}

export const masterDetailTester: RankedTester = rankWith(
  6,
  uiTypeIs('ListWithDetail')
);
