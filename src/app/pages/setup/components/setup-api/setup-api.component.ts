import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiConfigService } from 'src/app/services/api-config.service';

@Component({
  selector: 'vex-setup-api',
  templateUrl: './setup-api.component.html',
  styleUrls: ['./setup-api.component.scss']
})
export class SetupApiComponent implements OnInit {

  apiConfig = this.apiConfigService.config;

  form = this.fb.group({
    baseApiUrl: ['', Validators.required],
    tokenUrl: ['', Validators.required],
    registrationUrl: ['', Validators.required]
  });

  constructor(
    private apiConfigService: ApiConfigService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.reset();
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  submit() {
    this.apiConfig.next(this.form.getRawValue());
    this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Data berhasil disimpan!', type: 'success' } });
  }

  reset() {
    this.form.patchValue(this.apiConfig);
  }
}
