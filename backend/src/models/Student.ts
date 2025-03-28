import mongoose, { Schema, Document } from "mongoose";

// Define the interface for TypeScript type safety
interface IStudent extends Document {
  batch: string;
  courses: string[];
  count: number;
  year: string;
  semester: string;
  department: string;
}

const studentSchema = new Schema<IStudent>(
  {
    batch: {
      type: String,
      required: true,
    },
    courses: {
      type: [String], // Array of strings
      required: true,
    },
    count: {
      type: Number,
      required: true,
      min: 0,
    },
    year: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Changed model name from "Lecture" to "Student" to match the concept
const Student = mongoose.model<IStudent>("Student", studentSchema);
export default Student;
