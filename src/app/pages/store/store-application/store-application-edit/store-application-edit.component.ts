import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { finalize } from 'rxjs/operators';
import { ApplicationService } from 'src/app/services/application.service';
import { TierService } from 'src/app/services/tier.service';
import { Application } from 'src/app/types/application.interface';
import { Tier } from 'src/app/types/tier.interface';

@Component({
  selector: 'vex-store-application-edit',
  templateUrl: './store-application-edit.component.html',
  styleUrls: ['./store-application-edit.component.scss']
})
export class StoreApplicationEditComponent implements OnInit {

  isNew = true;
  isLoading = false;

  model: Application;
  tiers: Tier[];

  icClose = icClose;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    throttlingTier: ['Unlimited', Validators.required],
    callbackUrl: [''],
    groupId: ['']
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<StoreApplicationEditComponent>,
    private tierService: TierService,
    private applicationService: ApplicationService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.model = this.data;

    if (this.model?.applicationId) {
      this.isNew = true;
      this.form.patchValue(this.model);
    }

    this.tierService.applicationTiers().subscribe(rs => this.tiers = rs.list);
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  submit() {
    const formData = this.form.getRawValue();
    const application = { ...this.model, ...formData };

    this.isLoading = true;
    this.applicationService.createOrUpdateApplication(application)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(data => {
        this.dialogRef.close(data);
      });
  }
}

