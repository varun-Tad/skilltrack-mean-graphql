export type CourseLevel = 'Begineer' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: CourseLevel;
  duration: number;
}
