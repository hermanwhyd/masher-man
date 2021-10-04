import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { finalize } from 'rxjs/operators';
import { ApplicationService } from 'src/app/services/application.service';
import { Application } from 'src/app/types/application.interface';

@Component({
  selector: 'vex-store-application-key',
  templateUrl: './store-application-key.component.html',
  styleUrls: ['./store-application-key.component.scss']
})
export class StoreApplicationKeyComponent implements OnInit {

  isLoading = false;

  model: Application;
  keyTypes: string[] = ['PRODUCTION', 'SANDBOX'];

  icClose = icClose;

  form = this.fb.group({
    validityTime: [3600, Validators.required],
    keyType: ['PRODUCTION', Validators.required],
    accessAllowDomains: [['ALL']],
    scopes: [['am_application_scope', 'default']],
    supportedGrantTypes: [['urn:ietf:params:oauth:grant-type:saml2-bearer', 'iwa:ntlm', 'refresh_token', 'client_credentials', 'password']]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<StoreApplicationKeyComponent>,
    private applicationService: ApplicationService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.model = this.data;
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  submit() {
    const formData = this.form.getRawValue();
    this.applicationService.generateKey(this.model.applicationId, formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(data => {
        const keys = [...this.model.keys];
        const idx = keys.findIndex(k => k.keyType === formData.keyType);

        if (idx > -1) {
          keys[idx] = data;
        } else {
          keys.push(data);
        }

        this.dialogRef.close(keys);
      });
  }
}

