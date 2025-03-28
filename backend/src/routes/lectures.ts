import express, { Request, Response } from "express"; // Use 'import' instead of 'require'
import Lecture from "../models/Lecture"; // Consistently use 'import'

const router = express.Router();

// Get all lectures
router.get("/", async (req: Request, res: Response) => {
  try {
    const lectures = await Lecture.find();
    res.json(lectures);
  } catch (err: unknown) {
    // Cast error to 'Error'
    if (err instanceof Error) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      res.status(500).json({
        message: "An unknown error occurred",
      });
    }
  }
});

// Create a Lecture
router.post("/", async (req: Request, res: Response) => {
  const lecture = new Lecture(req.body);
  try {
    const newLecture = await lecture.save();
    res.status(201).json(newLecture);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({
        message: err.message,
      });
    } else {
      res.status(400).json({
        message: "An unknown error occurred",
      });
    }
  }
});

// Update a Lecture
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const lecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(lecture);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({
        message: err.message,
      });
    } else {
      res.status(400).json({
        message: "An unknown error occurred",
      });
    }
  }
});

// Delete a Lecture
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Lecture.findByIdAndDelete(req.params.id);
    res.json({
      message: "Lecture deleted",
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        message: err.message,
      });
    } else {
      res.status(500).json({
        message: "An unknown error occurred",
      });
    }
  }
});

export default router;
