import mongoose, { Schema, Document } from "mongoose";

interface ITimetableEntry {
  lectureId: mongoose.Schema.Types.ObjectId;
  roomId: mongoose.Schema.Types.ObjectId;
  teacherId: mongoose.Schema.Types.ObjectId;
  studentBatch: string;
  startTime: Date;
  endTime: Date;
  date: Date;
}

interface ITimetable extends Document {
  institution: string;
  year: string;
  semester: string;
  entries: ITimetableEntry[];
}

const TimetableEntrySchema = new Schema<ITimetableEntry>({
  lectureId: { type: Schema.Types.ObjectId, ref: "Lecture", required: true },
  roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  studentBatch: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  date: { type: Date, required: true },
});

const TimetableSchema = new Schema<ITimetable>(
  {
    institution: { type: String, required: true },
    year: { type: String, required: true },
    semester: { type: String, required: true },
    entries: [TimetableEntrySchema],
  },
  { timestamps: true }
);

export default mongoose.model<ITimetable>("Timetable", TimetableSchema);
