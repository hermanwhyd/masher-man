import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PublisherEditComponent } from './publisher-edit/publisher-edit.component';
import { PublisherListComponent } from './publisher-list/publisher-list.component';
import { PublisherSwaggerComponent } from './publisher-swagger/publisher-swagger.component';
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
import { PublisherListDetailComponent } from './publisher-list/publisher-list-detail/publisher-list-detail.component';
import { QuicklinkModule } from 'ngx-quicklink';
import { MatButtonLoadingModule } from 'src/app/utilities/mat-button-loading/mat-button-loading.module';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { PublisherNewComponent } from './publisher-new/publisher-new.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { PublisherSwaggerImportComponent } from './publisher-new/publisher-swagger-import/publisher-swagger-import.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
import { MatBadgeModule } from '@angular/material/badge';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { JsonFormsCustomModule } from '../shared/controls/json-forms-custom.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: PublisherListComponent
  },
  {
    path: 'add',
    component: PublisherNewComponent,
  },
  {
    path: 'edit',
    component: PublisherEditComponent,
  },
  {
    path: 'import-swagger',
    component: PublisherSwaggerComponent,
  }
];

@NgModule({
  declarations: [
    PublisherEditComponent,
    PublisherListComponent,
    PublisherSwaggerComponent,
    PublisherListDetailComponent,
    PublisherNewComponent,
    PublisherSwaggerImportComponent
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
    JsonFormsCustomModule
  ],
  exports: [
    RouterModule,
    QuicklinkModule
  ]
})
export class PublisherModule { }
