import { Component, computed, signal, inject } from '@angular/core';
import { CourseService } from '../../services/course';
import { CourseCard } from '../../components/course-card/course-card';
import { Course, CourseLevel } from '../../models/course.model';
import { Router } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-course-list',
  imports: [CourseCard, EmptyState],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList {
  searchQuery = signal('');
  private readonly courseService = inject(CourseService); // Angular, give this component the CourseService available in the current injection context.
  private readonly router = inject(Router);

  selectedLevel = signal<CourseLevel | 'All'>('All');
  courses = this.courseService.getCourses();

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
    this.router.navigate(['/courses', course.id]);
  }
}
