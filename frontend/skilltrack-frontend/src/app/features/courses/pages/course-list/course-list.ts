import { Component, signal } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseCard } from '../../components/course-card/course-card';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../components/page-header/page-header';

@Component({
  selector: 'app-course-list',
  imports: [CourseCard, EmptyState, PageHeader],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList {
  courses = signal<Course[]>([
    {
      id: 'angular',
      title: 'Modern Angular',
      description: 'Learn standalone components, Signals, RxJS and scalable Angular architecture.',
      instructor: 'Sarah Chen',
      level: 'Intermediate',
      duration: 14,
    },

    {
      id: 'node',
      title: 'Node.js Backend Engineering',
      description: 'Build scalable backend APIs using Node.js, Express and modern server patterns.',
      instructor: 'Michael Lee',
      level: 'Intermediate',
      duration: 12,
    },

    {
      id: 'system-design',
      title: 'Frontend System Design',
      description:
        'Learn performance, caching, rendering strategies and scalable frontend architecture.',
      instructor: 'Emily Davis',
      level: 'Advanced',
      duration: 10,
    },
  ]);
}
