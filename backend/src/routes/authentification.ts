import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { config } from "../config";

// Define request body interfaces for better type safety
interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

const router = Router();

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      role,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({ token });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
});

// Login user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
