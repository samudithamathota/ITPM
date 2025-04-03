import express, { Request, Response } from "express";
import { TimeAllocationModel } from "../models/TimeAllocation";

const router = express.Router();

// Create or update time allocation
router.post("/", async (req: Request, res: Response) => {
  try {
    const { id, weekdays, weekends, settings } = req.body;
    const year = Number(id.year); // Ensure year is a number

    const existingAllocation = await TimeAllocationModel.findOne({
      "id.year": year,
    });

    if (existingAllocation) {
      const updated = await TimeAllocationModel.findOneAndUpdate(
        { "id.year": year },
        { weekdays, weekends, settings },
        { new: true }
      );
      return res.status(200).json(updated);
    } else {
      const newAllocation = new TimeAllocationModel({
        id,
        weekdays,
        weekends,
        settings,
      });
      await newAllocation.save();
      return res.status(201).json(newAllocation);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get time allocation by year
router.get("/:year", async (req: Request, res: Response) => {
  try {
    const year = Number(req.params.year); // Ensure year is a number
    const allocation = await TimeAllocationModel.findOne({
      "id.year": year,
    }).lean();

    if (!allocation) {
      return res.status(404).json({ message: "Time allocation not found" });
    }

    return res.status(200).json(allocation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all time allocations
router.get("/", async (req: Request, res: Response) => {
  try {
    const allocations = await TimeAllocationModel.find().lean();
    return res.status(200).json(allocations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete time allocation
router.delete("/:year", async (req: Request, res: Response) => {
  try {
    const year = Number(req.params.year); // Ensure year is a number
    await TimeAllocationModel.findOneAndDelete({ "id.year": year });
    return res.status(200).json({ message: "Time allocation deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
