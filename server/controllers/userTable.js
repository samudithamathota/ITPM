const { UserTable } = require("../models/schema");

// CREATE: Add a new user table entry
const userTableAdd = async (req, res) => {
  try {
    const { table_name, institution_name, comments, user_name } = req.body;
    const newUserTable = new UserTable({
      table_name,
      institution_name,
      comments,
      user_name,
    });
    await newUserTable.save();
    res.status(201).json(newUserTable);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ: Get all user table entries
const userTableGetAll = async (req, res) => {
  try {
    const userTables = await UserTable.find().populate("user_name");
    res.status(200).json(userTables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ: Get a single user table entry by ID
const userTableGetOne = async (req, res) => {
  try {
    const userTable = await UserTable.findById(req.params.id).populate(
      "user_name"
    );
    if (!userTable) {
      return res.status(404).json({ message: "User table entry not found" });
    }
    res.status(200).json(userTable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE: Modify an existing user table entry
const userTableUpdate = async (req, res) => {
  try {
    const updatedUserTable = await UserTable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUserTable) {
      return res.status(404).json({ message: "User table entry not found" });
    }
    res.status(200).json(updatedUserTable);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE: Remove a user table entry
const userTableDelete = async (req, res) => {
  try {
    const deletedUserTable = await UserTable.findByIdAndDelete(req.params.id);
    if (!deletedUserTable) {
      return res.status(404).json({ message: "User table entry not found" });
    }
    res.status(200).json({ message: "User table entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  userTableAdd,
  userTableGetAll,
  userTableGetOne,
  userTableUpdate,
  userTableDelete,
};
