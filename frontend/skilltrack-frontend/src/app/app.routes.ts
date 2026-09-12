import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home/home').then((m) => m.Home),
  },

  // {
  //   path: 'courses',
  //   loadComponent: () =>
  //     import('./features/courses/pages/course-list/course-list').then((m) => m.CourseList),
  // },
  // {
  //   path: 'courses/:id',
  //   loadComponent: () =>
  //     import('./features/courses/pages/course-details/course-details').then((m) => m.CourseDetails),
  // },

  {
    path: 'courses',
    loadChildren: () => import('./features/courses/courses.routes').then((m) => m.COURSE_ROUTES),
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
    loadComponent: () => import('./shared/pages/not-found/not-found').then((m) => m.NotFound),
  },
];
