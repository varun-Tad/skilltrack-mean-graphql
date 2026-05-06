import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    durationMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const quizQuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswerIndex: Number,
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "General",
      index: true,
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    resourceFiles: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ],

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lessons: [lessonSchema],

    quiz: [quizQuestionSchema],
  },
  { timestamps: true },
);

courseSchema.index({
  title: "text",
  description: "text",
  category: "text",
});

export default mongoose.model("Course", courseSchema);
