import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownDialogComponent } from './markdown-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { ShowdownModule } from 'ngx-showdown';

@NgModule({
  declarations: [
    MarkdownDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    IconModule,
    MatDividerModule,
    MatButtonModule,
    FlexLayoutModule,
    ShowdownModule.forRoot({
      flavor: 'github',
      tables: true
    }),
  ]
})
export class MarkdownDialogModule { }
