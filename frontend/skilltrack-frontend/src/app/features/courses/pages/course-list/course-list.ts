import { Component, computed, signal } from '@angular/core';

import { CourseCard } from '../../components/course-card/course-card';
import { Course, CourseLevel } from '../../models/course.model';

import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-course-list',
  imports: [CourseCard, EmptyState],
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

  searchQuery = signal('');

  selectedLevel = signal<CourseLevel | 'All'>('All');

  filteredCourses = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();

    const level = this.selectedLevel();

    return this.courses().filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query);

      const matchesLevel = level === 'All' || course.level === level;

      return matchesSearch && matchesLevel;
    });
  });

  courseCount = computed(() => this.filteredCourses().length);

  hasActiveFilters = computed(() => {
    return this.searchQuery().trim() !== '' || this.selectedLevel() !== 'All';
  });

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchQuery.set(input.value);
  }

  onLevelChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedLevel.set(select.value as CourseLevel | 'All');
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedLevel.set('All');
  }

  onCourseSelected(course: Course): void {
    console.log('Selected course:', course);
  }
}
