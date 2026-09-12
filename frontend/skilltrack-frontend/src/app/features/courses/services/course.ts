import { Injectable, Signal, signal } from '@angular/core';
import { Course } from '../models/course.model';

// Injectable is an angular decorator.This tells angular that this class partcipates in angular dependency injection system.
@Injectable({
  providedIn: 'root', // This makes the service available from the application's root environment injector.
})
export class CourseService {
  // Here readonly means the pproperty reference can't be reassigned.this.courses = signal([]) wouldn't be allowed But the signal itself is still writable inside the service.this.courses.set([]);
  private readonly courses = signal<Course[]>([
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

  getCourses(): Signal<Course[]> {
    // THis returns a read-only signal view.Consumers can courses() but can't do courses.set(...)
    return this.courses.asReadonly();
  }

  getCoursesById(id: string): Course | undefined {
    return this.courses().find((course) => course.id == id);
  }
}
