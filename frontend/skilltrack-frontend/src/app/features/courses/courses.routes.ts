import { Routes } from '@angular/router';

export const COURSE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/course-list/course-list').then((m) => m.CourseList),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/course-details/course-details').then((m) => m.CourseDetails),
  },
  {
    path: ':courseId/lessons/:lessonId',
    loadComponent: () =>
      import('./pages/lesson-details/lesson-details').then((m) => m.LessonDetails),
  },
];
