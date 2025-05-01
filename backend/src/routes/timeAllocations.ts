import express, { Request, Response } from "express";
import { TimeAllocationModel } from "../models/TimeAllocation"; // Import the TimeAllocation model

const router = express.Router();

// Get all time allocations
router.get("/", async (req: Request, res: Response) => {
  try {
    const timeAllocations = await TimeAllocationModel.find(); // Fetch all time allocations
    res.json(timeAllocations); // Return the list of time allocations
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message }); // Return error message
    } else {
      res.status(500).json({ error: "An unknown error occurred" }); // Handle unknown errors
    }
  }
});

// Get a single time allocation by year and semester
router.get(
  "/:year/:semester/:department",
  async (
    req: Request<{ year: string; semester: string; department: string }>,
    res: any
  ) => {
    try {
      const { year, semester, department } = req.params; // Extract year and semester from the request parameters
      const timeAllocation = await TimeAllocationModel.findOne({
        "allocationKey.year": year,
        "allocationKey.semester": semester, // Include semester in the query
        "allocationKey.department": department, // Include department in the query,
      });

      if (!timeAllocation) {
        return res.status(404).json({ message: "Time allocation not found" }); // Handle case where no document is found
      }

      res.json(timeAllocation); // Return the found time allocation
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message }); // Return error message
      } else {
        res.status(500).json({ error: "An unknown error occurred" }); // Handle unknown errors
      }
    }
  }
);

// Create a new time allocation entry
router.post("/", async (req: Request, res: Response) => {
  try {
    const newTimeAllocation = new TimeAllocationModel(req.body);
    const savedTimeAllocation = await newTimeAllocation.save();
    res.status(201).json(savedTimeAllocation);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// Update a time allocation by year and semester
router.put(
  "/:year/:semester/:department",
  async (
    req: Request<{ year: string; semester: string; department: string }>,
    res: any
  ) => {
    try {
      const { year, semester, department } = req.params; // Extract both year and semester
      const updatedTimeAllocation = await TimeAllocationModel.findOneAndUpdate(
        {
          "allocationKey.year": year,
          "allocationKey.semester": semester,
          "allocationKey.department": department,
        }, // Include semester in the query
        req.body,
        { new: true, runValidators: true } // Return the updated document and validate input
      );
      if (!updatedTimeAllocation) {
        return res.status(404).json({ message: "Time allocation not found" }); // Handle case where no document is found
      }
      res.json(updatedTimeAllocation); // Return the updated document
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message }); // Return error message
      } else {
        res.status(400).json({ error: "An unknown error occurred" }); // Handle unknown errors
      }
    }
  }
);

// Delete a time allocation by year and semester
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await TimeAllocationModel.findByIdAndDelete(req.params.id);
    res.json({
      message: "Allocation deleted",
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
