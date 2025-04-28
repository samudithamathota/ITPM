import express, { Request, Response } from "express";
import Room from "../models/Room";

const router = express.Router();

// Get all Rooms
router.get("/", async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
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

// Get a single Room by ID
router.get("/:id", async (req: Request, res: any) => {
  try {
    const room = await Room.findById(req.params.id); // Pass the ID to findById
    if (!room) {
      return res.status(404).json({ message: "Room not found" }); // Handle case where room is not found
    }
    res.json(room);
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

// Create a room
router.post("/", async (req: Request, res: Response) => {
  const room = new Room(req.body);
  try {
    const newRoom = await room.save();
    res.status(201).json(newRoom);
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

// Update a room
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(room);
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

// Delete a room
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({
      message: "Room deleted",
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
