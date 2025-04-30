// models/Lecture.js
import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      validate: {
        validator: (v: string) => /^[A-Za-z\s]+$/.test(v),
        message: "Only letters and spaces allowed for course name",
      },
    },
    code: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      trim: true,
      validate: {
        validator: (v: string) => /^[A-Za-z0-9]+$/.test(v),
        message: "Only letters and numbers allowed for course code",
      },
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      validate: {
        validator: (v: string) => /^[A-Za-z\s]+$/.test(v),
        message: "Only letters allowed for department",
      },
    },
    duration: {
      type: Number,
      required: true,
      min: [60, "Minimum duration is 60 minutes"],
      max: [180, "Maximum duration is 180 minutes"],
    },
    weeklyFrequency: {
      type: Number,
      required: true,
      min: [1, "Minimum weekly frequency is 1"],
    },
    building: {
      type: String,
      required: true,
      enum: {
        values: [
          "CS Building",
          "Science Complex",
          "Engineering Block",
          "Math Department",
          "Physics Lab",
        ],
        message: "Invalid building selection",
      },
    },
    requiresLab: {
      type: Boolean,
      default: false,
    },
    transitionTime: {
      type: Number,
      required: true,
      min: [5, "Minimum transition time is 5 minutes"],
      max: [15, "Maximum transition time is 15 minutes"],
    },
  },
  {
    timestamps: true,
  }
);

// Transform for consistent ID handling
lectureSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
