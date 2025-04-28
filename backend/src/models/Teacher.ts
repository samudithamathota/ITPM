// models/Teacher.js
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    courses: {
      type: [String],
      required: [true, "At least one course is required"],
      default: [],
    },
    availability: {
      type: String,
      required: [true, "Availability is required"],
      trim: true,
    },
    seniority: {
      type: Number,
      required: true,
      min: [1, "Seniority must be at least 1"],
      max: [5, "Seniority cannot exceed 5"],
      default: 1,
    },
    building: {
      type: String,
      required: [true, "Building is required"],
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
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Transform the schema to convert _id to id and remove version fields
teacherSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
