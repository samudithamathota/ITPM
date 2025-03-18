const express = require("express");
const router = express.Router();
const {
  Teacher,
  Subject,
  Student,
  Room,
  Building,
  Activity,
  UserTable,
} = require("../models/schema"); // Adjust the path to your models

router.get("/get", async (req, res) => {
  const { query } = req.query;
  const { user_table_id } = req.body; // need to change ->> req.query            // Assuming user_table_id is passed as a query parameter

  if (!user_table_id) {
    return res.status(400).json({ error: "user_table_id is required" });
  }

  let result = [];
  console.log(query);
  try {
    switch (query) {
      case "teachers":
        result = await Teacher.find({ user_table_id }).select(
          "teacher_id teach_name"
        );
        break;

      case "subjects":
        result = await Subject.find({ user_table_id }).select(
          "subj_id subj_name"
        );
        break;

      case "students":
        result = await Student.find({ user_table_id }).select(
          "student_id year_name num_students"
        );
        break;

      case "rooms":
        result = await Room.find({ user_table_id }).select(
          "room_id room_name capacity building_id"
        );
        break;

      case "buildings":
        result = await Building.find({ user_table_id }).select(
          "building_id build_name"
        );
        break;

      case "activities":
        result = await Activity.find({ user_table_id })
          .populate("teacher_id", "teach_name")
          .populate("subj_id", "subj_name")
          .populate("student_id", "year_name")
          .select("activities_id teacher_id student_id subj_id year_name");
        break;

      default:
        return res.status(400).json({ error: "Invalid query parameter" });
    }

    // Format the result to match the PHP output
    const formattedResult = result.map((item) => {
      const formattedItem = { id: item._id, ...item._doc };
      delete formattedItem._id;
      delete formattedItem.__v;
      return formattedItem;
    });

    res.json(formattedResult);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
