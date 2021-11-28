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
import { catchError, filter, finalize } from 'rxjs/operators';
import { ApiDetail } from 'src/app/types/api.interface';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublisherMasterListService } from '../services/publisher-master-list.service';
import { PublisherService } from 'src/app/pages/publisher/services/publisher.service';
import { throwError } from 'rxjs';

const keywords = ['#', 'properties', 'items'];

export const removeSchemaKeywords = (path: string) => {
  return path
    .split('/')
    .filter(s => !some(keywords, key => key === s))
    .join('.');
};

@UntilDestroy()
@Component({
  selector: 'vex-publisher-list-control-controller',
  template: `
    <mat-sidenav-container [fxHide]="hidden">
      <mat-sidenav mode="side" class="pr-2" opened>
        <mat-nav-list>
          <mat-list-item *ngIf="masterItems.length === 0"><span class="w-full text-center">No items</span></mat-list-item>
          <mat-list-item
            *ngFor="let item of masterItems;let i = index;trackBy: trackElement"
            [class.selected]="item === selectedItem"
            [ngClass]="item.data?.id ? 'callout callout-info' : 'callout callout-default'"
            (click)="onSelect(item, i)"
            (mouseover)="onListItemHover(i)"
            (mouseout)="onListItemHover(undefined)"
          >
            <a matLine [matTooltip]="item.label" matTooltipPosition="above">{{ item.label || 'No api name set' }}</a>
            <button mat-icon-button class="button hide" (click)="onDeleteClick(i)" [ngClass]="{ show: highlightedIdx == i }"
              matTooltip="Close Designer">
              <mat-icon mat-list-icon>remove_circle_outline</mat-icon>
            </button>
            <button mat-icon-button [loading]="isPublishing[item.label]" *ngIf="!isEnabled()"></button>
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
        <vex-jsonforms-detail *ngIf="selectedItem" [item]="selectedItem"></vex-jsonforms-detail>
        <vex-jsonform-empty *ngIf="!selectedItem"></vex-jsonform-empty>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
    ::ng-deep mat-slide-toggle {
      @apply mt-2 mb-4;
    }
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
      width: 25%;
    }
    ::ng-deep .mat-list-item-content {
      padding: 0 !important;
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

  isPublishing = {};

  constructor(
    private jsonFormsAngularService: JsonFormsAngularService,
    private publisherMasterListService: PublisherMasterListService,
    private publiserService: PublisherService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
    super(jsonFormsAngularService);
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

    this.registerCreate();
    this.registerRefresh();
    this.registerPublish();
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
        message: 'Are you sure you want to close the selected entry?',
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

  registerCreate() {
    this.publisherMasterListService.createEmit$
      .pipe(filter<ApiDetail>(Boolean), untilDestroyed(this))
      .subscribe((api) => {
        this.addItem(this.propsPath, api)();
      });
  }

  registerRefresh() {
    this.publisherMasterListService.refreshEmit$
      .pipe(untilDestroyed(this), filter<string>(Boolean))
      .subscribe((str: string) => {
        this.jsonFormsService.refresh();
      });
  }

  registerPublish() {
    this.publisherMasterListService.publishEmit$
      .pipe(untilDestroyed(this), filter<string[]>(Boolean))
      .subscribe((str: string[]) => {
        this.isPublishing[this.selectedItem.data.name] = true;
        this.jsonFormsService.setReadonly(true);
        const apid: ApiDetail = this.selectedItem.data;

        const draftApiD = { ...apid };

        draftApiD.apiDefinition = (typeof apid.apiDefinition === 'string') ? apid.apiDefinition : JSON.stringify(apid.apiDefinition);

        if (draftApiD.endpointConfig.sandbox_endpoints?.url === '') {
          delete (draftApiD.endpointConfig.sandbox_endpoints);
        }
        draftApiD.endpointConfig = JSON.stringify(draftApiD.endpointConfig);

        this.publiserService.createOrUpdateApi(draftApiD)
          .pipe(untilDestroyed(this), finalize(() => {
            this.jsonFormsService.setReadonly(false);
            this.isPublishing[draftApiD.name] = false;
          }), catchError(error => throwError(error)))
          .subscribe({
            next: data => {
              apid.id = data.id;
              this.jsonFormsAngularService.refresh();
              this.snackBar.openFromComponent(SnackbarNotifComponent, {
                data: { message: 'Save and publish API successfully', type: 'success' },
                duration: 5000
              });
            },
            error: err => console.log('subsErr', err)
          });
      });
  }
}

export const masterDetailTester: RankedTester = rankWith(
  6,
  uiTypeIs('ListWithDetail')
);
