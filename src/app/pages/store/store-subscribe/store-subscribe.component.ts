import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';

import icClose from '@iconify/icons-ic/twotone-close';
import { finalize } from 'rxjs/operators';
import { Api } from 'src/app/types/api.interface';
import { Application, Subscription } from 'src/app/types/application';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { StoreService } from '../services/store.service';
import { StoreListComponent } from '../store-list/store-list.component';

@Component({
  selector: 'vex-store-subscribe',
  templateUrl: './store-subscribe.component.html',
  styleUrls: ['./store-subscribe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreSubscribeComponent implements OnInit {

  icClose = icClose;

  isLoading = true;
  isSubmitting = false;

  applicationList: Application[];
  apis: Api[];

  isShowId = false;
  isShowError = false;

  applications = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Api[],
    private storeService: StoreService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<StoreListComponent>,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.apis = this.data;
    this.fetchApplication();
  }

  fetchApplication(): void {
    this.storeService.getApplications(0, 1000)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cd.markForCheck();
      }))
      .subscribe(rs => {
        this.applicationList = rs.list.filter(s => s.status === 'APPROVED');
      });
  }

  get submitable(): boolean {
    return this.applications.valid && this.applications.touched;
  }

  submit(appSelections: MatListOption[], apiSelections: MatListOption[]) {
    const subscriptions = [] as Subscription[];
    appSelections.forEach(s => {
      apiSelections.forEach(a => {
        subscriptions.push({
          tier: 'Unlimited',
          apiIdentifier: a.value.id,
          applicationId: s.value.applicationId
        });
      });
    });

    this.isSubmitting = true;
    this.isShowError = false;
    this.storeService.subscribeApi(subscriptions).pipe(finalize(() => {
      this.isSubmitting = false;
      this.cd.markForCheck();
    })).subscribe(rs => {
      this.snackBar.openFromComponent(
        SnackbarNotifComponent,
        { data: { message: 'APIs subscription success with status ON_HOLD, pending for approval!', type: 'success' } }
      );
      this.dialogRef.close();
    }, error => {
      this.isShowError = true;
    });
  }

  onSelectionChange() {
    this.cd.markForCheck();
  }
}
