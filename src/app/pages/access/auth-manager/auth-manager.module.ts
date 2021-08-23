import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthManagerComponent } from './auth-manager.component';
import { RouterModule, Routes } from '@angular/router';
import { WidgetUserComponent } from './widgets/widget-user/widget-user.component';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonFamilyModule } from 'src/app/common/mat-button-family.module';
import { MatRippleModule } from '@angular/material/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'publisher'
  },
  {
    path: ':activeCategory',
    component: AuthManagerComponent
  }
];

@NgModule({
  declarations: [
    AuthManagerComponent,
    WidgetUserComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatIconModule,
    IconModule,
    FlexLayoutModule,
    MatTabsModule,
    MatButtonFamilyModule,
    MatRippleModule
  ]
})
export class AuthManagerModule { }
