import express, { Request, Response } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

// Ensure MONGODB_URI exists before using it
const MONGO_URI = process.env.MONGODB_URI as string;
if (!MONGO_URI) {
  console.error("Error: MONGODB_URI is not defined in environment variables.");
  process.exit(1); // Exit process if no DB URI is provided
}

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import teacherRoutes from "./routes/teachers";
import lectureRoutes from "./routes/lectures";
import roomRoutes from "./routes/rooms";
import studentRoutes from "./routes/student";
import timeAllocationRoutes from "./routes/timeAllocations";

// Routes
app.use("/api/teachers", teacherRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/time-allocations", timeAllocationRoutes);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err: unknown) => {
    console.error("❌ Could not connect to MongoDB:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
