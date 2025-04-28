import express, { Request, Response } from "express";
import mongoose from "mongoose";
const router = express.Router();

// Import models
import { Timetable } from "../models/TimeTable";
import Lecture from "../models/Lecture";
import Room from "../models/Room";
import Teacher from "../models/Teacher";

// Middleware to validate ObjectId
const validateObjectIds = (ids: string[]) => {
  return (req: Request, res: Response, next: any) => {
    for (const id of ids) {
      if (!mongoose.Types.ObjectId.isValid(req.body[id])) {
        return res.status(400).json({ error: `Invalid ${id} ID format` });
      }
    }
    next();
  };
};

// Create timetable
router.post("/", async (req: Request, res: any) => {
  try {
    const { institution, year, semester, entries, status } = req.body;

    // Validate required fields
    if (!institution || !year || !semester) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate entries
    for (const entry of entries) {
      const { lecture, room, teacher } = entry;

      // Check if referenced documents exist
      const [lectureExists, roomExists, teacherExists] = await Promise.all([
        Lecture.findById(lecture),
        Room.findById(room),
        Teacher.findById(teacher),
      ]);

      if (!lectureExists || !roomExists || !teacherExists) {
        return res
          .status(400)
          .json({ error: "One or more referenced documents not found" });
      }
    }

    const timetable = new Timetable({
      institution,
      year,
      semester,
      entries,
      status: status || "draft",
    });

    await timetable.save();
    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get timetable by year and semester
router.get("/:year/:semester", async (req: Request, res: any) => {
  try {
    const { year, semester } = req.params;

    const timetable = await Timetable.findOne({ year, semester })
      .populate("entries.lecture")
      .populate("entries.room")
      .populate("entries.teacher");

    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update timetable
router.put("/:id", async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const timetable = await Timetable.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("entries.lecture")
      .populate("entries.room")
      .populate("entries.teacher");

    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete timetable
router.delete("/:id", async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const timetable = await Timetable.findByIdAndDelete(id);

    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
