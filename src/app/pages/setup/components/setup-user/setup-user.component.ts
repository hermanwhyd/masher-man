import { Component, Input, OnInit } from '@angular/core';
import _ from 'lodash';
import icEdit from '@iconify/icons-ic/edit';
import icAdd from '@iconify/icons-ic/add-circle';
import icTrash from '@iconify/icons-ic/delete';

import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { ApiConfig, User } from 'src/app/types/api-config.interface';
import { SetupUserEditComponent } from './setup-user-edit/setup-user-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';

@Component({
  selector: 'vex-setup-user',
  templateUrl: './setup-user.component.html',
  styleUrls: ['./setup-user.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class SetupUserComponent implements OnInit {
  @Input() DESCRIPTION: string;
  @Input() TITLE: string;
  @Input() TYPE: string;

  icAdd = icAdd;
  icEdit = icEdit;
  icTrash = icTrash;

  isLoading = false;

  configs: ApiConfig[];
  config: ApiConfig;
  users: User[];

  constructor(
    private apiConfigService: ApiConfigService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.apiConfigService.configs$.subscribe((configs: ApiConfig[]) => {

      this.configs = configs;
      this.config = this.configs.find(c => c.active === true);
      if (!this.config) {
        this.config = {
          profile: this.apiConfigService.getActiveProfile().name, active: true
          , userPublishers: [], userStores: [], userApiManagers: []
        } as ApiConfig;
        this.configs.push(this.config);
      }

      console.log(this.config);
      if (this.TYPE === 'publisher') {
        this.users = this.config.userPublishers;
      } else if (this.TYPE === 'store') {
        this.users = this.config.userStores;
      } else if (this.TYPE === 'apimanager') {
        this.users = this.config.userApiManagers;
      } else {
        this.users = [];
      }
    });
  }

  createOrUpdateModel() {
    this.dialog.open(SetupUserEditComponent, {
      width: '400px',
      disableClose: true
    })
      .afterClosed().subscribe((newModel: User) => {
        if (!newModel) { return; }

        this.users.push(newModel);
        this.snackBar.openFromComponent(SnackbarNotifComponent, { data: { message: 'Data berhasil disimpan!', type: 'success' } });
        this.apiConfigService.configs.next(this.configs);
      });
  }

  removeModel(model: User) {
    const idx = this.users.indexOf(model);
    this.users.splice(idx, 1);
    this.apiConfigService.configs.next(this.configs);
  }
}
