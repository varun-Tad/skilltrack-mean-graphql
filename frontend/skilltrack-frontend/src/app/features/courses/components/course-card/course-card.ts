import { Component, input, output } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-card',

  imports: [MatCardModule, MatButtonModule],

  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCard {
  // Data received from CourseList
  course = input.required<Course>();

  // Event sent back to CourseList
  courseSelected = output<Course>();

  selectCourse(): void {
    this.courseSelected.emit(this.course());
  }
}
