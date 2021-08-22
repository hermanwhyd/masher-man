import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PublisherEditComponent } from './publisher-edit/publisher-edit.component';
import { PublisherListComponent } from './publisher-list/publisher-list.component';
import { PublisherSwaggerComponent } from './publisher-swagger/publisher-swagger.component';

const routes: Routes = [
  {
    path: '',
    component: PublisherListComponent,
  },
  {
    path: 'swagger-client',
    component: PublisherEditComponent,
  },
  {
    path: 'import',
    component: PublisherEditComponent,
  }
];

@NgModule({
  declarations: [
    PublisherEditComponent,
    PublisherListComponent,
    PublisherSwaggerComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class PublisherModule { }
