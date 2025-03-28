import mongoose, { Schema, Document } from "mongoose";

// Define the interface for TypeScript type safety
interface ILecture extends Document {
  name: string;
  courseCode: string;
  teacherId: mongoose.Schema.Types.ObjectId;
  duration?: number;
  type?: "lecture" | "lab" | "tutorial";
  capacity?: number;
}

const lectureSchema = new Schema<ILecture>(
  {
    name: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
      unique: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    duration: {
      type: Number,
      default: 60,
    },
    type: {
      type: String,
      enum: ["lecture", "lab", "tutorial"],
      default: "lecture",
    },
    capacity: {
      type: Number,
      default: 60,
    },
  },
  { timestamps: true }
);

const Lecture = mongoose.model<ILecture>("Lecture", lectureSchema);
export default Lecture;
