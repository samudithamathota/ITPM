import express, { Request, Response } from "express";
import TimeAllocationModel from "../models/TimeAllocation";

const router = express.Router();

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

// Update a time allocation by year
// router.put("/:year", async (req: Request<{ year: string }>, res: Response) => {
//   try {
//     const { year } = req.params;
//     const updatedTimeAllocation = await TimeAllocationModel.findOneAndUpdate(
//       { "id.year": year },
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedTimeAllocation) {
//       return res.status(404).json({ message: "Time allocation not found" });
//     }
//     res.json(updatedTimeAllocation);
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(400).json({ error: error.message });
//     } else {
//       res.status(400).json({ error: "An unknown error occurred" });
//     }
//   }
// });

export default router;
