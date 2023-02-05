import { Routes } from "@angular/router";

export const routes : Routes = [
  {
    path: '',
    redirectTo: 'available',
    pathMatch: 'full',
  },
  {
    path: 'available',
    loadComponent: () => import('./pages/available/available.page').then((m) => m.AvailableEnrollmentsPage),
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history.page').then((m) => m.HistoryEnrollmentsPage),
  },
];
