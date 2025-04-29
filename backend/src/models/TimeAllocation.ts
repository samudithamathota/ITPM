import { Schema, model, Document } from "mongoose";

// Interface for TypeScript
interface TimeAllocation extends Document {
  allocationKey: {
    year: string;
    semester: string;
  };
  weekdays?: {
    [day: string]: {
      availableSlots: string[];
      unavailableSlots: string[];
    };
  };
  weekends?: {
    [day: string]: {
      availableSlots: string[];
      unavailableSlots: string[];
    };
  };
  settings: {
    slotDuration: number;
    weekdayStartTime: string;
    weekdayEndTime: string;
    weekendStartTime: string;
    weekendEndTime: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TimeAllocationSchema = new Schema<TimeAllocation>(
  {
    allocationKey: {
      year: { type: String, required: true },
      semester: { type: String, required: true },
    },
    weekdays: {
      type: Map,
      of: new Schema({
        availableSlots: [String],
        unavailableSlots: [String],
      }),
      default: {},
    },
    weekends: {
      type: Map,
      of: new Schema({
        availableSlots: [String],
        unavailableSlots: [String],
      }),
      default: {},
    },
    settings: {
      slotDuration: { type: Number, required: true },
      weekdayStartTime: { type: String, required: true },
      weekdayEndTime: { type: String, required: true },
      weekendStartTime: { type: String, required: true },
      weekendEndTime: { type: String, required: true },
    },
  },
  {
    timestamps: true,
    collection: "time_allocations",
  }
);

// Unique index for year + semester
TimeAllocationSchema.index(
  { "allocationKey.year": 1, "allocationKey.semester": 1 },
  { unique: true }
);

export const TimeAllocationModel = model<TimeAllocation>(
  "TimeAllocation",
  TimeAllocationSchema
);
