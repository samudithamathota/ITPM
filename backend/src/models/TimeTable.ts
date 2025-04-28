// models/Timetable.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITimetableEntry {
  lecture: Types.ObjectId;
  room: Types.ObjectId;
  teacher: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  day: string;
  studentBatches: string[];
}

export interface ITimetable extends Document {
  institution: string;
  year: string;
  semester: string;
  entries: ITimetableEntry[];
  status: "draft" | "published" | "archived";
}

const TimetableEntrySchema = new Schema<ITimetableEntry>({
  lecture: { type: Schema.Types.ObjectId, ref: "Lecture", required: true },
  room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  day: { type: String, required: true },
  studentBatches: [{ type: String, required: true }],
});

const TimetableSchema = new Schema<ITimetable>(
  {
    institution: { type: String, required: true },
    year: { type: String, required: true },
    semester: { type: String, required: true },
    entries: [TimetableEntrySchema],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export const Timetable = mongoose.model<ITimetable>(
  "Timetable",
  TimetableSchema
);
