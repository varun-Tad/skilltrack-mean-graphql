export const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String
  }

  type Lesson {
    _id: ID!
    title: String!
    content: String
    videoUrl: String
    durationMinutes: Int
  }

  type QuizQuestion {
    _id: ID!
    question: String
    options: [String]
    correctAnswerIndex: Int
  }

  type ResourceFile {
  fileName: String
  fileUrl: String
  fileType: String
}

  type Course {
  _id: ID!
  title: String!
  description: String
  thumbnailUrl: String
  resourceFiles: [ResourceFile]
  category: String
  level: String
  instructor: User
  lessons: [Lesson]
  quiz: [QuizQuestion]
  createdAt: String
  }

  type Progress {
    _id: ID!
    student: User
    course: Course
    completedLessons: [ID]
    quizScore: Int
    quizCompleted: Boolean
  }

  type AuthPayload {
    user: User!
  }

  type CoursePage {
    courses: [Course]
    currentPage: Int
    totalPages: Int
    hasMore: Boolean
    totalCourses: Int
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    role: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input LessonInput {
    title: String!
    content: String
    videoUrl: String
    durationMinutes: Int
  }

  input QuizQuestionInput {
    question: String!
    options: [String!]!
    correctAnswerIndex: Int!
  }

  input CourseInput {
    title: String!
    description: String
    category: String
    level: String
    lessons: [LessonInput]
    quiz: [QuizQuestionInput]
  }

  type Query {
    me: User
    courses(page: Int, limit: Int, search: String): CoursePage
    course(id: ID!): Course
    myProgress(courseId: ID!): Progress
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload
    login(input: LoginInput!): AuthPayload
    logout: Boolean

    createCourse(input: CourseInput!): Course
    updateCourse(id: ID!, input: CourseInput!): Course
    deleteCourse(id: ID!): Boolean

    markLessonComplete(courseId: ID!, lessonId: ID!): Progress
    submitQuiz(courseId: ID!, answers: [Int!]!): Progress
  }
`;
