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

  proxyApi = this.apiConfigService.proxyApi;

  form = this.fb.group({
    proxyApi: ['', Validators.required],
  });

  constructor(
    private apiConfigService: ApiConfigService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.reset();
  }

  get submitable(): boolean {
    return this.form.valid;
  }

  get resetable(): boolean {
    return !(!this.form.pristine && this.form.valid);
  }

  get formControl() {
    return this.form.controls;
  }

  submit() {
    const url = this.formControl.proxyApi.value;
    this.apiConfigService.getProfile(url).subscribe((rs) => {
      rs[0].active = true;
      this.apiConfigService.proxyApi.next(url);
      this.apiConfigService.profiles.next(rs);
      this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Data berhasil disimpan!', type: 'success' } });
      this.reset();
    });
  }

  reset() {
    this.form.patchValue({ proxyApi: this.proxyApi.value });
    this.form.markAsPristine();
  }
}
