import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VexRoutes } from 'src/@vex/interfaces/vex-route.interface';
import { AuthGuard } from './auth/guard/auth.guard';
import { MainGuard } from './auth/guard/main.guard';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';

const routes: VexRoutes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/access/login/loging.module').then(m => m.LoginModule),
    // canActivate: [AuthGuard]
  },
  {
    path: 'logout',
    loadChildren: () => import('./pages/access/logout/logout.module').then(m => m.LogoutModule),
    // canActivate: [MainGuard]
  },
  {
    path: '',
    component: CustomLayoutComponent,
    // canActivateChild: [MainGuard],
    // canLoad: [MainGuard],
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
        path: 'no-access',
        loadChildren: () => import('./pages/access/error-403/error-403.module').then(m => m.Error403Module)
      },
      {
        path: '**',
        loadChildren: () => import('./pages/access/maintenance/maintenance.module').then(m => m.MaintenanceModule)
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
