// models/TimeAllocation.model.ts
import { Schema, model, Document } from "mongoose";

interface DaySlots {
  availableSlots: string[];
  unavailableSlots: string[];
}

interface TimeAllocationSettings {
  slotDuration: number;
  weekdayStartTime: string;
  weekdayEndTime: string;
  weekendStartTime: string;
  weekendEndTime: string;
}

interface TimeAllocationDocument extends Document {
  id: {
    year: number;
  };
  weekdays?: {
    [day: string]: DaySlots;
  };
  weekends?: {
    [day: string]: DaySlots;
  };
  settings: TimeAllocationSettings;
}

const TimeAllocationSchema = new Schema<TimeAllocationDocument>({
  id: {
    year: { type: Number, required: true }, // Changed from String to Number
  },
  weekdays: {
    type: Map,
    of: new Schema({
      availableSlots: [String],
      unavailableSlots: [String],
    }),
    required: false,
  },
  weekends: {
    type: Map,
    of: new Schema({
      availableSlots: [String],
      unavailableSlots: [String],
    }),
    required: false,
  },
  settings: {
    slotDuration: { type: Number, required: true },
    weekdayStartTime: { type: String, required: true },
    weekdayEndTime: { type: String, required: true },
    weekendStartTime: { type: String, required: true },
    weekendEndTime: { type: String, required: true },
  },
});

export const TimeAllocationModel = model<TimeAllocationDocument>(
  "TimeAllocation",
  TimeAllocationSchema
);
