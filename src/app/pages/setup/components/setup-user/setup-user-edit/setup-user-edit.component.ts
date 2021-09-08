import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { of } from 'rxjs';
import { catchError, filter, finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/pages/access/auth-manager/services/auth.service';
import { RegisterRs } from 'src/app/pages/access/auth-manager/services/oauth.interface';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { Profile, User } from 'src/app/types/api-config.interface';
import { encode, encodeDigest } from 'src/app/utilities/function/base64-util';

@Component({
  selector: 'vex-setup-user-edit',
  templateUrl: './setup-user-edit.component.html',
  styleUrls: ['./setup-user-edit.component.scss']
})
export class SetupUserEditComponent implements OnInit {

  isNew = true;
  isLoading = false;
  isFetched = false;

  activeProfile: Profile;

  icClose = icClose;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    grant_types: [{ value: '', disabled: true }],
    client_id: [{ value: '', disabled: true }],
    client_secret: [{ value: '', disabled: true }],
    active: [true]
  });

  constructor(
    private authService: AuthService,
    private apiConfigService: ApiConfigService,
    private dialogRef: MatDialogRef<SetupUserEditComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.apiConfigService.profiles$.subscribe(p => {
      this.activeProfile = p.find(f => f.active === true);
    });
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  fetch() {
    this.isLoading = true;
    this.isFetched = false;

    const model: any = this.form.getRawValue();
    const digest = encodeDigest(model.username, model.password);
    this.authService.register(
      {
        callbackUrl: '',
        clientName: 'rest_api_publisher',
        grantType: 'password refresh_token',
        saasApp: true,
        owner: model.username
      }, digest)
      .pipe(
        finalize(() => this.isLoading = false)
        , catchError(() => {
          return of(null);
        }), filter<RegisterRs>(Boolean))
      .subscribe(rs => {
        this.isFetched = true;

        model.client_id = rs.clientId;
        model.client_secret = rs.clientSecret;
        const json = JSON.parse(rs.jsonString);
        model.grant_types = json?.grant_types;

        this.form.patchValue(model);
      });
  }

  submit() {
    const model = this.form.getRawValue();
    const clientDigest = encodeDigest(model.client_id, model.client_secret);
    const password = encode(model.password);
    const user = { username: model.username, grantTypes: model.grant_types, password, clientDigest, active: model.active } as User;
    this.dialogRef.close(user);
  }
}

