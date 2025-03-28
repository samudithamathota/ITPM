import mongoose, { Schema, Document } from "mongoose";

// Define the interface for TypeScript type safety
interface IRoomAllocation extends Document {
  building: string;
  roomName: string;
  roomType: "Lecture Hall" | "Laboratory";
  roomCapacity: number;
  laboratoryType?:
    | "Research and development"
    | "Medical or Clinical"
    | "PC"
    | "Chemistry"
    | "Physics"
    | "Biological"
    | "Engineering";
  availability: "available" | "unavailable";
}

const roomAllocationSchema = new Schema<IRoomAllocation>(
  {
    building: {
      type: String,
      required: true,
    },
    roomName: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      enum: ["Lecture Hall", "Laboratory"],
      default: "Lecture Hall",
    },
    roomCapacity: {
      type: Number,
      required: true,
    },
    laboratoryType: {
      type: String,
      enum: [
        "Research and development",
        "Medical or Clinical",
        "PC",
        "Chemistry",
        "Physics",
        "Biological",
        "Engineering",
      ],
      validate: {
        validator: function (value: string) {
          // Ensure laboratoryType is set only if roomType is 'Laboratory'
          return this.roomType === "Laboratory" ? !!value : !value;
        },
        message: "Laboratory type is required when room type is 'Laboratory'",
      },
    },
    availability: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true }
);

const RoomAllocation = mongoose.model<IRoomAllocation>(
  "RoomAllocation",
  roomAllocationSchema
);
export default RoomAllocation;
