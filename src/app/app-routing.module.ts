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
    redirectTo: 'courses',
  },
  {
    path: 'formations',
    loadComponent: () => import('./formations/formations.page').then((c) => c.FormationsPage),
    loadChildren: () => import('./formations/routes').then((r) => r.routes),
  },
  {
    path: '',
    loadComponent: () => import('./shared/layouts/app-layout/app-layout.component').then((m) => m.AppLayoutComponent),
    canActivate: [AuthGuard],
    data: {
      authentified: true,
      redirect: 'login',
    },
    children: [
      {
        path: 'courses',
        loadComponent: () => import('./courses/course.page').then((m) => m.CoursePage),
        loadChildren: () => import('./courses/routes').then((m) => m.routes),
      },
      {
        path: 'admin',
        canActivate: [SiteRoleGuard],
        data: {
          acceptedRoles: [SiteRole.SECRETARY, SiteRole.ADMINISTRATOR],
          forbiddenRoles: [],
          redirect: 'courses'
        },
        loadComponent: () => import('./admin/admin.page').then((m) => m.AdminPage),
        loadChildren: () => import('./admin/routes').then((m) => m.routes),
      }
    ]
  },


  {
    path: '',
    loadComponent: () => import('./shared/ui/layouts/AuthLayout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    canActivate: [AuthGuard],
    data: {
      authentified: false,
      redirect: 'courses',
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
  exports: [RouterModule]
})
export class AppRoutingModule {}
