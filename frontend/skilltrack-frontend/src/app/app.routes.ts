import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home/home').then((m) => m.Home),
  },

  {
    path: 'courses',
    loadComponent: () =>
      import('./features/courses/pages/course-list/course-list').then((m) => m.CourseList),
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
  },

  {
    path: '**',
    redirectTo: '',
  },
];
