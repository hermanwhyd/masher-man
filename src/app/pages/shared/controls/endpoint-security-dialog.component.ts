import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiDetail } from 'src/app/types/api.interface';

@Component({
  selector: 'vex-endpoint-security-dialog',
  template: `
<form (ngSubmit)="submit()" [formGroup]="form" autocomplete="off">
  <div fxLayout="row" fxLayoutAlign="space-between center" mat-dialog-title>
    <h2 class="headline m-0" fxFlex="auto">
      Endpoint Security
      <span class="bg-teal-light text-teal p-1 rounded-full text-sm">BASIC</span>
    </h2>
  </div>

  <mat-divider class="-mx-6 mb-4 text-border"></mat-divider>

  <mat-dialog-content fxLayout="column">

    <span class="text-hint mb-4 text-sm">The Endpoint is secured with basic or digest Auth</span>

    <mat-form-field appearance="outline">
      <mat-label>Username</mat-label>
      <input formControlName="username" matInput required>
      <mat-error *ngIf="(formControl.username.touched) && formControl.username.errors?.required">
        Password is required
      </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Password</mat-label>
      <input cdkFocusInitial formControlName="password" matInput required>
      <mat-error *ngIf="(formControl.password.touched) && formControl.password.errors?.required">
        Password is required
      </mat-error>
    </mat-form-field>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button mat-dialog-close type="button">CANCEL</button>
    <button color="primary" mat-button type="submit" [disabled]="!submitable">SAVE</button>
  </mat-dialog-actions>
</form>

  `,
})
export class EndpointSecurityDialogComponent implements OnInit {

  form = this.fb.group({
    type: [{ value: '', disabled: true }],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ApiDetail,
    public dialogRef: MatDialogRef<EndpointSecurityDialogComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form.patchValue(this.data.endpointSecurity);
  }

  get submitable(): boolean {
    return this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  submit() {
    this.dialogRef.close(this.form.getRawValue());
  }

}
