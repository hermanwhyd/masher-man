import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconModule } from '@visurel/iconify-angular';
import { BreadcrumbsModule } from 'src/@vex/components/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { ContainerModule } from 'src/@vex/directives/container/container.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { QuicklinkModule } from 'ngx-quicklink';
import { MatButtonLoadingModule } from 'src/app/utilities/mat-button-loading/mat-button-loading.module';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { MatBadgeModule } from '@angular/material/badge';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { JsonFormsCustomModule } from '../shared/controls/json-forms-custom.module';
import { StoreListComponent } from './store-list/store-list.component';
import { StoreListDetailComponent } from './store-list/store-list-detail/store-list-detail.component';
import { StoreSubscribeComponent } from './store-subscribe/store-subscribe.component';
import { StoreApplicationComponent } from './store-application/store-application.component';
import { StoreApplicationDetailComponent } from './store-application/store-application-detail/store-application-detail.component';
import { StoreApplicationEditComponent } from './store-application/store-application-edit/store-application-edit.component';
import { StoreAppNamePipe } from '../../pipes/store-app-name.pipe';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: StoreListComponent
  },
  {
    path: 'application',
    component: StoreApplicationComponent
  }
];

@NgModule({
  declarations: [
    StoreListComponent,
    StoreListDetailComponent,
    StoreSubscribeComponent,
    StoreApplicationComponent,
    StoreApplicationDetailComponent,
    StoreApplicationEditComponent,
    StoreAppNamePipe
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    PageLayoutModule,
    FlexLayoutModule,
    BreadcrumbsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    IconModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatInputModule,
    ContainerModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonLoadingModule,
    MatTabsModule,
    NgxShimmerLoadingModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    NgxJsonViewerModule,
    MatExpansionModule,
    MatChipsModule,
    MatDialogModule,
    MatStepperModule,
    SecondaryToolbarModule,
    MatBadgeModule,
    NgJsonEditorModule,
    JsonFormsCustomModule,
  ],
  exports: [
    RouterModule,
    QuicklinkModule
  ]
})
export class StoreModule { }
