import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'formations',
    loadComponent: () => import('./formations/formations.page').then((c) => c.FormationsPage),
    loadChildren: () => import('./formations/routes').then((r) => r.routes),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/feature/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
    data: {
      authentified: true,
      redirect: 'login',
    }
  },
  {
    path: '',
    loadComponent: () => import('./shared/ui/layouts/AuthLayout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    canActivate: [AuthGuard],
    data: {
      authentified: false,
      redirect: 'home',
    },
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/feature/login.page').then((m) => m.LoginPage),
        loadChildren: () => import('./login/feature/routes').then((m) => m.routes),
      },
      {
        path: 'register',
        loadComponent: () => import('./register/feature/register.page').then((m) => m.RegisterPage),
        loadChildren: () => import('./register/feature/routes').then((m) => m.routes),
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
