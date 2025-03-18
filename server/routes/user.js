const express = require("express");
const router = express.Router();
const { User } = require("../models/schema");
const bcryptjs = require("bcryptjs");

// CREATE: Add a new user
router.post("/add", async (req, res) => {
  console.log("upto thiz part, code is working!");

  try {
    const { user_name, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ user_name, password: hashedPassword });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ: Get all users
router.get("/getAll", async (req, res) => {
  try {
    const users = await User.find({}, "user_name"); // Exclude password for security
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ: Get a single user by ID
router.get("/get:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "user_name"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE: Modify a user
router.put("/update:id", async (req, res) => {
  try {
    const { user_name, password } = req.body;
    let updateData = { user_name };
    if (password) {
      updateData.password = await bcryptjs.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Remove a user
router.delete("/delete:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
