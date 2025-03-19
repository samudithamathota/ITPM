const {
  Teacher,
  Subject,
  Student,
  Building,
  Room,
  Activity,
} = require("../models/schema"); // Adjust the path to your models

const updateRow = async (req, res) => {
  const { query, object_id } = req.query; // Extract query and id from request parameters
  const updateData = req.body; // Extract update data from request body
  console.log(query, object_id);
  console.log(req.query);

  if (!object_id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    let result;
    console.log(query);
    switch (query) {
      case "teachers":
        result = await Teacher.findByIdAndUpdate(
          object_id,
          { teach_name: updateData.teach_name },
          { new: true }
        );
        break;

      case "subjects":
        result = await Subject.findByIdAndUpdate(
          object_id,
          { subj_name: updateData.subj_name },
          { new: true }
        );
        break;

      case "students":
        result = await Student.findByIdAndUpdate(
          object_id,
          {
            year_name: updateData.year_name,
            num_students: updateData.num_students,
          },
          { new: true }
        );
        break;

      case "buildings":
        result = await Building.findByIdAndUpdate(
          object_id,
          { build_name: updateData.build_name },
          { new: true }
        );
        break;

      case "rooms":
        result = await Room.findByIdAndUpdate(
          object_id,
          {
            room_name: updateData.room_name,
            capacity: updateData.capacity,
          },
          { new: true }
        );
        break;

      case "activities":
        const { teacher_id, student_id, subj_id } = updateData;
        result = await Activity.findByIdAndUpdate(
          object_id,
          {
            teacher_id,
            student_id,
            subj_id,
          },
          { new: true }
        );
        break;

      default:
        return res.status(400).json({ error: "Invalid query parameter" });
    }

    if (!result) {
      return res.status(404).json({ error: "Record not found or not updated" });
    }

    res.json({ success: true, updatedRecord: result });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateRow };
