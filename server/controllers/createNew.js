const {
  Teacher,
  Subject,
  Student,
  Building,
  Room,
  Activity,
} = require("../models/schema");

const createNew = async (req, res) => {
  const { query } = req.query; // Extract query parameter
  const { user_table_id } = req.body; // need to change ->> req.query
  const createData = req.body;

  if (!user_table_id) {
    return res.status(400).json({ error: "User table ID is required" });
  }

  try {
    let result;
    console.log(createData);

    switch (query) {
      case "teachers":
        if (!createData.teach_name)
          return res.status(400).json({ error: "Teacher name is required" });
        result = await Teacher.create({
          teach_name: createData.teach_name,
          user_table_id,
        });
        break;

      case "subjects":
        if (!createData.subj_name)
          return res.status(400).json({ error: "Subject name is required" });
        result = await Subject.create({
          subj_name: createData.subj_name,
          user_table_id,
        });
        break;

      case "students":
        if (!createData.year_name || !createData.num_students) {
          return res
            .status(400)
            .json({ error: "Year name and number of students are required" });
        }
        result = await Student.create({
          year_name: createData.year_name,
          num_students: createData.num_students,
          user_table_id,
        });
        break;

      case "buildings":
        if (!createData.build_name)
          return res.status(400).json({ error: "Building name is required" });
        result = await Building.create({
          build_name: createData.build_name,
          user_table_id,
        });
        break;

      case "rooms":
        if (
          !createData.room_name ||
          !createData.capacity ||
          !createData.build_id
        ) {
          return res.status(400).json({
            error: "Room name, capacity, and building ID are required",
          });
        }
        result = await Room.create({
          room_name: createData.room_name,
          capacity: createData.capacity,
          building_id: createData.build_id,
          user_table_id,
        });
        break;

      case "activities":
        const { teacher_id, student_id, subj_id } = createData;
        if (!teacher_id || !student_id || !subj_id) {
          return res.status(400).json({
            error: "Teacher ID, Student ID, and Subject ID are required",
          });
        }
        result = await Activity.create({
          teacher_id,
          student_id,
          subj_id,
          user_table_id,
          duration: 21,
          total_duration: 12,
          active: true,
        });
        break;

      default:
        return res.status(400).json({ error: "Invalid query parameter" });
    }

    console.log(`Created ${query}:`, result);

    if (!result) {
      return res.status(500).json({ error: "Record not inserted" });
    }

    res.json({ success: true, insertedId: result._id });
  } catch (error) {
    console.error("Error creating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createNew };
