import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { config } from "../config";
const router = express.Router();

// Stronger TypeScript interfaces
interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string; // Optional (validate in middleware)
}

interface LoginRequest {
  email: string;
  password: string;
}

// Register a new user
router.post("/signUp", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate required fields (redundant safety check)
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Case-insensitive email check
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" }); // 409 Conflict
    }

    // Create and save user
    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password,
    });
    await user.save();

    // Generate JWT (avoid storing sensitive data in token)
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return token + safe user data (no password)
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Login user
export const logIn = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user (+password since it's `select: false` in model)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" }); // Generic message for security
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return token + safe user data
    return res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
