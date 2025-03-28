import mongoose, { Schema, Document } from "mongoose";

// Define the interface for TypeScript type safety
interface ITeacher extends Document {
  name: string;
  email: string;
  department: string;
  specialization?: string;
  maxHoursPerWeek?: number;
  seniority?: "junior" | "senior" | "head";
  building?: string;
}

const teacherSchema = new Schema<ITeacher>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
    },
    maxHoursPerWeek: {
      type: Number,
      default: 60,
    },
    seniority: {
      type: String,
      enum: ["junior", "senior", "head"],
      default: "junior",
    },
    building: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);
export default Teacher;
