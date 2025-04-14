import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  name: string;
  building: string;
  department: string;
  capacity: number;
  availability: string;
  type: number;
}

const RoomSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    building: { type: String, required: true },
    department: { type: String, required: true },
    capacity: { type: Number, required: true },
    availability: { type: String, default: "Available" },
    type: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", RoomSchema);
