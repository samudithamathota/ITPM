import mongoose, { Schema, Document } from "mongoose";

// Define the interface for TypeScript type safety
interface ITimeAllocation extends Document {
  day: string;
  timeSlot: string;
  lectureId: mongoose.Schema.Types.ObjectId;
  roomNumber: string;
  building?: string;
  isRecurring: boolean;
  sessionType: "lecture" | "tutorial" | "revision";
}

const timeAllocationSchema = new Schema<ITimeAllocation>(
  {
    day: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    building: {
      type: String,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    sessionType: {
      type: String,
      enum: ["lecture", "tutorial", "revision"],
      default: "lecture",
    },
  },
  {
    timestamps: true,
  }
);

const TimeAllocation = mongoose.model<ITimeAllocation>(
  "TimeAllocation",
  timeAllocationSchema
);
export default TimeAllocation;
