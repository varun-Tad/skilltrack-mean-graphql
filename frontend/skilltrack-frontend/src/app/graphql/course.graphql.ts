import { gql } from 'apollo-angular';

export const GET_COURSES = gql`
  query Courses($page: Int, $limit: Int, $search: String) {
    courses(page: $page, limit: $limit, search: $search) {
      courses {
        _id
        title
        description
        category
        level
        thumbnailUrl

        instructor {
          name
          email
        }
        lessons {
          _id
          title
          durationMinutes
        }
      }
      currentPage
      totalPages
      hasMore
      totalCourses
    }
  }
`;

export const GET_COURSE = gql`
  query Course($id: ID!) {
    course(id: $id) {
      _id
      title
      description
      category
      level
      thumbnailUrl

      resourceFiles {
        fileName
        fileUrl
        fileType
      }
      instructor {
        _id
        name
        email
      }
      lessons {
        _id
        title
        content
        videoUrl
        durationMinutes
      }
      quiz {
        _id
        question
        options
        correctAnswerIndex
      }
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CourseInput!) {
    createCourse(input: $input) {
      _id
      title
      description
      category
      level
    }
  }
`;

export const MARK_LESSON_COMPLETE = gql`
  mutation MarkLessonComplete($courseId: ID!, $lessonId: ID!) {
    markLessonComplete(courseId: $courseId, lessonId: $lessonId) {
      _id
      completedLessons
      quizScore
      quizCompleted
    }
  }
`;

export const MY_PROGRESS = gql`
  query MyProgress($courseId: ID!) {
    myProgress(courseId: $courseId) {
      _id
      completedLessons
      quizScore
      quizCompleted
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: CourseInput!) {
    updateCourse(id: $id, input: $input) {
      _id
      title
      description
      category
      level
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

export const SUBMIT_QUIZ = gql`
  mutation SubmitQuiz($courseId: ID!, $answers: [Int!]!) {
    submitQuiz(courseId: $courseId, answers: $answers) {
      _id
      completedLessons
      quizScore
      quizCompleted
    }
  }
`;
