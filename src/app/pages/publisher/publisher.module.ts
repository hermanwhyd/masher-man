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
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

const routes: Routes = [
  {
    path: '',
    component: PublisherListComponent
  },
  {
    path: 'edit',
    component: PublisherEditComponent,
  },
  {
    path: 'import-swagger',
    component: PublisherEditComponent,
  }
];

@NgModule({
  declarations: [
    PublisherEditComponent,
    PublisherListComponent,
    PublisherSwaggerComponent,
    PublisherListDetailComponent,
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
    NgxJsonViewerModule
  ],
  exports: [
    RouterModule,
    QuicklinkModule
  ]
})
export class PublisherModule { }
