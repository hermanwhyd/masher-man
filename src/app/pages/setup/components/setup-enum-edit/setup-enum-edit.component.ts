import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import icClose from '@iconify/icons-ic/twotone-close';
import { SharedProperty } from 'src/app/types/shared-property.interface';

@Component({
  selector: 'vex-setup-enum-edit',
  templateUrl: './setup-enum-edit.component.html',
  styleUrls: ['./setup-enum-edit.component.scss']
})
export class SetupEnumEditComponent implements OnInit {
  isNew = true;
  submitted = false;

  icClose = icClose;

  model: SharedProperty;

  form = this.fb.group({
    id: null,
    group: ['', Validators.required],
    label: ['', Validators.required],
    code: ['', Validators.required],
  });

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<SetupEnumEditComponent>,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.model = {...this.data.model, group: this.data.group};
    this.form.patchValue(this.model);
    this.form.get('group').setValue(this.data.group);
    if (this.model.id) {
      this.isNew = false;
      this.form.get('code').disable();
    }
  }

  get submitable(): boolean {
    return !this.form.pristine && this.form.valid;
  }

  get formControl() {
    return this.form.controls;
  }

  submit() {
    this.submitted = true;
    const form = this.form.getRawValue();
    this.model = {
      ...form
      , id: this.model.id
    };

    this.dialogRef.close(this.model);
  }
}
