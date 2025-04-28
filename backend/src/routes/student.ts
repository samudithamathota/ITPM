import express, { Request, Response } from "express";
import Student from "../models/Student";

const router = express.Router();

// Get all students
router.get("/", async (req: Request, res: Response) => {
  try {
    const student = await Student.find();
    res.json(student);
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

// Get a student by ID
router.get("/:id", async (req: Request, res: any) => {
  try {
    const student = await Student.findById(req.params.id); // Fetch student by ID
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
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

// Create a student
router.post("/", async (req: Request, res: Response) => {
  try {
    const student = new Student(req.body);
    const newStudent = await student.save(); // Call save() on the instance, not the model
    res.status(201).json(newStudent);
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

// Update a student
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(student);
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

// Delete a student
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({
      message: "Student deleted",
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
