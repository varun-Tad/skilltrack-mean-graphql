import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  CREATE_COURSE,
  DELETE_COURSE,
  GET_COURSE,
  GET_COURSES,
  MARK_LESSON_COMPLETE,
  MY_PROGRESS,
  SUBMIT_QUIZ,
  UPDATE_COURSE,
} from '../../graphql/course.graphql';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private apollo: Apollo) {}

  getCourses(page = 1, limit = 8, search = '') {
    return this.apollo.watchQuery({
      query: GET_COURSES,
      variables: {
        page,
        limit,
        search,
      },
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  getCourse(id: string) {
    return this.apollo.watchQuery({
      query: GET_COURSE,
      variables: { id },
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  createCourse(input: any) {
    return this.apollo.mutate({
      mutation: CREATE_COURSE,
      variables: { input },
    });
  }

  markLessonComplete(courseId: string, lessonId: string) {
    return this.apollo.mutate({
      mutation: MARK_LESSON_COMPLETE,
      variables: {
        courseId,
        lessonId,
      },
    });
  }

  getMyProgress(courseId: string) {
    return this.apollo.watchQuery({
      query: MY_PROGRESS,
      variables: { courseId },
      fetchPolicy: 'network-only',
    }).valueChanges;
  }

  updateCourse(id: string, input: any) {
    return this.apollo.mutate({
      mutation: UPDATE_COURSE,
      variables: { id, input },
    });
  }

  deleteCourse(id: string) {
    return this.apollo.mutate({
      mutation: DELETE_COURSE,
      variables: { id },
    });
  }

  submitQuiz(courseId: string, answers: number[]) {
    return this.apollo.mutate({
      mutation: SUBMIT_QUIZ,
      variables: {
        courseId,
        answers,
      },
    });
  }
}
