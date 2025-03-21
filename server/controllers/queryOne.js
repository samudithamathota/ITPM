const {
  Teacher,
  Subject,
  Student,
  Room,
  Building,
  Activity,
  UserTable,
} = require("../models/schema");

const queryOne = async (req, res) => {
  const { query, id, user_tble_id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  const _id = id; // Assign id to _id

  let result = [];
  console.log(query, _id, user_table_id); // Log for debugging
  try {
    switch (query) {
      case "teachers":
        result = await Teacher.find({ user_table_id, _id }).select(
          "teacher_id teach_name"
        );
        break;

      case "subjects":
        result = await Subject.find({ user_table_id, _id }).select(
          "subj_id subj_name"
        );
        break;

      case "students":
        result = await Student.find({ user_table_id, _id }).select(
          "student_id year_name num_students"
        );
        break;

      case "rooms":
        result = await Room.find({ user_table_id, _id }).select(
          "room_id room_name capacity building_id"
        );
        break;

      case "buildings":
        result = await Building.find({ user_table_id, _id }).select(
          "building_id build_name"
        );
        break;

      case "activities":
        result = await Activity.find({ user_table_id, _id })
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
      const formattedItem = { _id: item._id, ...item._doc };
      delete formattedItem._id;
      delete formattedItem.__v;
      return formattedItem;
    });

    res.json(formattedResult);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { queryOne };
