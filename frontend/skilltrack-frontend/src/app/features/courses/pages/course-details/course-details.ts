import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-details',
  imports: [RouterLink],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss',
})
export class CourseDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);

  //this.route.snapshot -> This means give me the route information as it exists right now
  // paramMap.get('id') -> retrieves the route paramter named id: which corresponds to path:course/:id

  courseId = this.route.snapshot.paramMap.get('id');
  course = this.courseId ? this.courseService.getCoursesById(this.courseId) : undefined;

  startLearning(): void {
    if (!this.course) {
      return;
    }

    console.log(`Starting course: ${this.course.title}`);
  }
}
