const {
  Teacher,
  Subject,
  Student,
  Room,
  Building,
  Activity,
} = require("../models/schema"); // Adjust the path to your models

const destroy = async (req, res) => {
  const { query, object_id } = req.query; // Extract query and object_id from request parameters

  if (!object_id) {
    return res.status(400).json({ error: "object_id is required" });
  }
  console.log(query, object_id);
  console.log(req.query);

  try {
    let result;

    switch (query) {
      case "teachers":
        result = await Teacher.findByIdAndDelete(object_id);
        break;

      case "subjects":
        result = await Subject.findByIdAndDelete(object_id);
        break;

      case "students":
        result = await Student.findByIdAndDelete(object_id);
        break;

      case "rooms":
        result = await Room.findByIdAndDelete(object_id);
        break;

      case "buildings":
        result = await Building.findByIdAndDelete(object_id);
        break;

      case "activities":
        result = await Activity.findByIdAndDelete(object_id);
        break;

      default:
        return res.status(400).json({ error: "Invalid query parameter" });
    }

    if (!result) {
      return res.status(404).json({ error: "Record not found or not deleted" });
    }

    res.json({ success: true, deletedId: object_id });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { destroy };
