import express, { Request, Response } from "express";
import Teacher from "../models/Teacher";

const router = express.Router();

// Get all teachers
router.get("/", async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      res.status(500).json({
        message: "Unknown error occurred",
      });
    }
  }
});

// Create a teacher
router.post("/", async (req: Request, res: Response) => {
  const teacher = new Teacher(req.body);
  try {
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({
        message: err.message,
      });
    } else {
      res.status(400).json({
        message: "Unknown error occurred",
      });
    }
  }
});

// Update a teacher
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(teacher);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({
        message: err.message,
      });
    } else {
      res.status(400).json({
        message: "Unknown error occurred",
      });
    }
  }
});

// Delete a teacher
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({
      message: "Teacher deleted",
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      res.status(500).json({
        message: "Unknown error occurred",
      });
    }
  }
});

export default router;
