import express, { Request, Response } from "express";

import jwt from "jsonwebtoken";
import User from "../models/User"; // Adjust path according to your structure

const router = express.Router();

router.post("/register", async (req: Request, res: any) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user (password will be hashed by the pre-save hook)
    const user = new User({
      fullName,
      email,
      password,
    });

    // Save user to database
    const savedUser = await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    // Return user data and token (exclude password)
    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (val: any) => val.message
      );
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error during registration" });
  }
});

export default router;
