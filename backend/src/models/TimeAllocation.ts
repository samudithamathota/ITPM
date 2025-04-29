import { Schema, model, Document } from "mongoose";

// Interface for TypeScript
interface TimeAllocation extends Document {
  id: {
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
    id: {
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
    timestamps: true, // Adds createdAt and updatedAt automatically
    collection: "time_allocations",
  }
);

// Compound unique index for year + semester combination
TimeAllocationSchema.index(
  { "id.year": 1, "id.semester": 1 },
  { unique: true }
);

export const TimeAllocationModel = model<TimeAllocation>(
  "TimeAllocation",
  TimeAllocationSchema
);
