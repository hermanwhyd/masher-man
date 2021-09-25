import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';

const routes: VexRoutes = [
  {
    path: '',
    component: CustomLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { roles: [] }
      },
      {
        path: 'publisher',
        loadChildren: () => import('./pages/publisher/publisher.module').then(m => m.PublisherModule),
        data: { roles: [] }
      },
      {
        path: 'store',
        loadChildren: () => import('./pages/store/store.module').then(m => m.StoreModule),
        data: { roles: [] }
      },
      {
        path: 'setup',
        loadChildren: () => import('./pages/setup/setup.module').then(m => m.SetupModule),
        data: { roles: [] }
      },
      {
        path: '**',
        loadChildren: () => import('./pages/access/error-404/error-404.module').then(m => m.Error404Module)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: QuicklinkStrategy,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule, QuicklinkModule]
})
export class AppRoutingModule {
}
