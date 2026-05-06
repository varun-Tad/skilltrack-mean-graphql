import User from "../models/User.js";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import { generateToken } from "../utils/generateToken.js";
import { redisClient } from "../config/redis.js";

const requireAuth = (user) => {
  if (!user) {
    throw new Error("Not authenticated");
  }
};

const requireInstructor = (user) => {
  requireAuth(user);

  if (!["instructor", "admin"].includes(user.role)) {
    throw new Error("Only instructors or admins can perform this action");
  }
};

export const resolvers = {
  Query: {
    me: async (_, __, context) => {
      return context.user;
    },

    courses: async (_, { page = 1, limit = 8, search = "" }) => {
      const cacheKey = `courses:page:${page}:limit:${limit}:search:${search}`;

      const cachedCourses = await redisClient.get(cacheKey);

      if (cachedCourses) {
        return JSON.parse(cachedCourses);
      }

      const skip = (Number(page) - 1) * Number(limit);

      const query = search
        ? {
            $text: {
              $search: search,
            },
          }
        : {};

      const courses = await Course.find(query)
        .populate("instructor", "_id name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const totalCourses = await Course.countDocuments(query);

      const response = {
        courses,
        currentPage: Number(page),
        totalPages: Math.ceil(totalCourses / Number(limit)),
        hasMore: skip + courses.length < totalCourses,
        totalCourses,
      };

      await redisClient.setEx(cacheKey, 60, JSON.stringify(response));

      return response;
    },

    course: async (_, { id }) => {
      return Course.findById(id).populate("instructor", "_id name email role");
    },

    myProgress: async (_, { courseId }, context) => {
      requireAuth(context.user);

      return Progress.findOne({
        student: context.user._id,
        course: courseId,
      }).populate("student course");
    },
  },

  Mutation: {
    register: async (_, { input }, context) => {
      const existingUser = await User.findOne({ email: input.email });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const user = await User.create(input);

      const token = generateToken(user._id);

      context.res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        user,
      };
    },

    login: async (_, { input }, context) => {
      const user = await User.findOne({ email: input.email });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await user.comparePassword(input.password);

      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      const token = generateToken(user._id);

      context.res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        user,
      };
    },

    logout: async (_, __, context) => {
      context.res.clearCookie("token");
      return true;
    },

    createCourse: async (_, { input }, context) => {
      requireInstructor(context.user);

      const course = await Course.create({
        ...input,
        instructor: context.user._id,
      });

      await clearCourseCache();

      return Course.findById(course._id).populate(
        "instructor",
        "name email role",
      );
    },

    updateCourse: async (_, { id, input }, context) => {
      requireInstructor(context.user);

      const course = await Course.findById(id);

      if (!course) {
        throw new Error("Course not found");
      }

      if (
        course.instructor.toString() !== context.user._id.toString() &&
        context.user.role !== "admin"
      ) {
        throw new Error("Not allowed");
      }

      Object.assign(course, input);

      await course.save();

      await clearCourseCache();

      return Course.findById(course._id).populate(
        "instructor",
        "name email role",
      );
    },

    deleteCourse: async (_, { id }, context) => {
      requireInstructor(context.user);

      const course = await Course.findById(id);

      if (!course) {
        throw new Error("Course not found");
      }

      if (
        course.instructor.toString() !== context.user._id.toString() &&
        context.user.role !== "admin"
      ) {
        throw new Error("Not allowed");
      }

      await Course.findByIdAndDelete(id);

      await clearCourseCache();

      return true;
    },

    markLessonComplete: async (_, { courseId, lessonId }, context) => {
      requireAuth(context.user);

      const course = await Course.findById(courseId);

      if (!course) {
        throw new Error("Course not found");
      }

      const progress = await Progress.findOneAndUpdate(
        {
          student: context.user._id,
          course: courseId,
        },
        {
          $addToSet: {
            completedLessons: lessonId,
          },
        },
        {
          new: true,
          upsert: true,
        },
      ).populate("student course");

      return progress;
    },

    submitQuiz: async (_, { courseId, answers }, context) => {
      requireAuth(context.user);

      const course = await Course.findById(courseId);

      if (!course) {
        throw new Error("Course not found");
      }

      let score = 0;

      course.quiz.forEach((question, index) => {
        if (answers[index] === question.correctAnswerIndex) {
          score += 1;
        }
      });

      const progress = await Progress.findOneAndUpdate(
        {
          student: context.user._id,
          course: courseId,
        },
        {
          quizScore: score,
          quizCompleted: true,
        },
        {
          new: true,
          upsert: true,
        },
      ).populate("student course");

      return progress;
    },
  },
};
