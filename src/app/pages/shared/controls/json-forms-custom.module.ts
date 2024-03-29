import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { AccountPortalComponent } from './account-portal.component';
import { ApiDefinitionControlComponent } from './api-definition-control.component';
import { JsonformEmptyComponent } from './master-detail/jsonform-empty.component';
import { PublisherArrayPrimitiveControlComponent } from './publisher-array-primitive-control.component';
import { PublisherDataDisplayComponent } from './publisher-data-display.component';
import { JsonFormsModule } from '@jsonforms/angular';
import { MatTableModule } from '@angular/material/table';
import { MasterListComponent } from './master-detail/master-list.component';
import { JsonFormsDetailComponent } from './master-detail/jsonforms-detail.component';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonLoadingModule } from 'src/app/utilities/mat-button-loading/mat-button-loading.module';
import { MatChipsModule } from '@angular/material/chips';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PublisherEndpointUrlControlComponent } from './publisher-endpointurl-control.component';
import { MarkdownDialogModule } from 'src/app/utilities/markdown-dialog/markdown-dialog.module';
import { RouterModule } from '@angular/router';
import { PublisherApiTiersControlComponent } from './publisher-apitiers-control.component';
import { KeyMapperComponent } from './keymapper-portal.component';

const ARRAY_COMPONENTS = [
  PublisherDataDisplayComponent,
  PublisherArrayPrimitiveControlComponent,
  MasterListComponent,
  JsonFormsDetailComponent,
  JsonformEmptyComponent,
  ApiDefinitionControlComponent,
  AccountPortalComponent,
  PublisherEndpointUrlControlComponent,
  PublisherApiTiersControlComponent,
  KeyMapperComponent
];

@NgModule({
  declarations: [
    ...ARRAY_COMPONENTS
  ],
  imports: [
    CommonModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    MatTableModule,
    MatIconModule,
    IconModule,
    MatTooltipModule,
    MatButtonLoadingModule,
    MatChipsModule,
    NgJsonEditorModule,
    NgxJsonViewerModule,
    MatButtonToggleModule,
    MarkdownDialogModule,
    RouterModule
  ],
  exports: [
    ...ARRAY_COMPONENTS
  ]
})
export class JsonFormsCustomModule { }
