import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { SiteRoleGuard } from './core/guards/site-role/site-role.guard';
import SiteRole from './core/models/SiteRole';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    redirectTo: 'enrollments',
  },
  {
    path: '',
    loadComponent: () => import('./shared/layouts/app/app.layout').then((m) => m.AppLayout),
    canActivate: [AuthGuard],
    data: {
      authentified: true,
      redirect: 'login',
    },
    children: [
      {
        path: 'enrollments',
        loadComponent: () => import('./enrollments/enrollments.page').then((m) => m.EnrollmentsPage),
        loadChildren: () => import('./enrollments/routes').then((m) => m.routes),
      },
      {
        path: 'admin',
        canActivate: [SiteRoleGuard],
        data: {
          acceptedRoles: [SiteRole.SECRETARY, SiteRole.ADMINISTRATOR],
          forbiddenRoles: [],
          redirect: 'home'
        },
        loadComponent: () => import('./admin/admin.page').then((m) => m.AdminPage),
        loadChildren: () => import('./admin/routes').then((m) => m.routes),
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./shared/layouts/auth/auth.layout').then((m) => m.AuthLayout),
    canActivate: [AuthGuard],
    data: {
      authentified: false,
      redirect: 'home',
    },
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
        loadChildren: () => import('./login/routes').then((m) => m.routes),
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.page').then((m) => m.RegisterPage),
        loadChildren: () => import('./register/routes').then((m) => m.routes),
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    }),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
