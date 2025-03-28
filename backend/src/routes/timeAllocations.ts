import { Router, Request, Response } from "express";
import Time from "../models/TimeAllocation";

const router = Router();

// Get all times
router.get("/", async (req: Request, res: Response) => {
  try {
    const times = await Time.find();
    res.json(times);
  } catch (err: unknown) {
    res.status(500).json({
      message: (err as Error).message,
    });
  }
});

// Create a time
router.post("/", async (req: Request, res: Response) => {
  const time = new Time(req.body);
  try {
    const newTime = await time.save();
    res.status(201).json(newTime);
  } catch (err: unknown) {
    res.status(400).json({
      message: (err as Error).message,
    });
  }
});

// Update a time
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const time = await Time.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(time);
  } catch (err: unknown) {
    res.status(400).json({
      message: (err as Error).message,
    });
  }
});

// Delete a time
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Time.findByIdAndDelete(req.params.id);
    res.json({
      message: "Time deleted",
    });
  } catch (err: unknown) {
    res.status(500).json({
      message: (err as Error).message,
    });
  }
});

export default router;
