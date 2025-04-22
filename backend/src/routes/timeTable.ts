import express from "express";
const router = express.Router();

import { Request, Response } from "express";
import { generateTimetable } from "../services/timeTable";
import Timetable from "../models/TimeTable"; // Make sure to import your Timetable model

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { year, semester, institution, startDate, endDate } = req.body;

    const timetable = await generateTimetable({
      year,
      semester,
      institution,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      data: timetable,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/:year/:semester", async (req: Request, res: Response) => {
  try {
    const { year, semester } = req.params;
    const timetable = await Timetable.findOne({ year, semester });
    res.status(200).json({ success: true, data: timetable });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
