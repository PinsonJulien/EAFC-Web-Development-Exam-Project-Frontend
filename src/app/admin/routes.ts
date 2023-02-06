import { Routes } from "@angular/router";


export const routes : Routes = [
  {
    path: '',
    redirectTo: 'enrollments',
    pathMatch: 'full',
  },
  {
    path: 'enrollments',
    loadComponent: () => import('./pages/enrollments/enrollments-admin.page').then((m) => m.EnrollmentsAdminPage),
  },
];
