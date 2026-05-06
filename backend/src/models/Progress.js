import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    quizScore: {
      type: Number,
      default: 0,
    },

    quizCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
