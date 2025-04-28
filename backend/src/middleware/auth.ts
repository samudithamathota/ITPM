// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Authentication required");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    ) as { userId: string };
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" });
  }
};
