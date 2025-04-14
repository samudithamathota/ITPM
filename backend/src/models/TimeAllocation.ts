import { Schema, model, Document } from "mongoose";

interface TimeSlotSettings {
  slotDuration: number;
  weekdayStartTime: string;
  weekdayEndTime: string;
  weekendStartTime: string;
  weekendEndTime: string;
}

interface DaySlots {
  availableSlots: string[];
  unavailableSlots: string[];
}

interface TimeAllocationId {
  year: string;
  semester: string;
}

interface TimeAllocationDocument extends Document {
  id: TimeAllocationId;
  weekdays?: {
    [day: string]: DaySlots;
  };
  weekends?: {
    [day: string]: DaySlots;
  };
  settings: TimeSlotSettings;
}

const TimeAllocationIdSchema = new Schema<TimeAllocationId>(
  {
    year: { type: String, required: true },
    semester: { type: String, required: true },
  },
  { _id: false }
);

const DaySlotsSchema = new Schema<DaySlots>(
  {
    availableSlots: { type: [String], default: [] },
    unavailableSlots: { type: [String], default: [] },
  },
  { _id: false }
);

const TimeSlotSettingsSchema = new Schema<TimeSlotSettings>(
  {
    slotDuration: { type: Number, required: true },
    weekdayStartTime: { type: String, required: true },
    weekdayEndTime: { type: String, required: true },
    weekendStartTime: { type: String, required: true },
    weekendEndTime: { type: String, required: true },
  },
  { _id: false }
);

const TimeAllocationSchema = new Schema<TimeAllocationDocument>({
  id: { type: TimeAllocationIdSchema, required: true, unique: true },
  weekdays: {
    type: Map,
    of: DaySlotsSchema,
    required: false,
  },
  weekends: {
    type: Map,
    of: DaySlotsSchema,
    required: false,
  },
  settings: { type: TimeSlotSettingsSchema, required: true },
});

// Compound index for the composite ID
TimeAllocationSchema.index(
  { "id.year": 1, "id.semester": 1 },
  { unique: true }
);

const TimeAllocationModel = model<TimeAllocationDocument>(
  "TimeAllocation",
  TimeAllocationSchema
);

export default TimeAllocationModel;
