const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// User Schema
const UserSchema = new mongoose.Schema({
  user_name: { type: String, required: true, unique: true, maxlength: 10 },
  password: { type: String, required: true },
});

// UserTable Schema
const UserTableSchema = new mongoose.Schema({
  user_table_id: { type: Number, unique: true },
  table_name: { type: String },
  institution_name: { type: String },
  comments: { type: String },
  user_name: {
    type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId for consistency
    ref: "User",
    required: true,
  },
});

// UserFile Schema
const UserFileSchema = new mongoose.Schema({
  user_files_id: { type: Number, unique: true },
  file_type: { type: String },
  file_size: { type: String },
  file_content: { type: String },
  file_name: { type: String },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
});

// Semester Schema
const SemesterSchema = new mongoose.Schema({
  sem_id: { type: Number, unique: true },
  sem_name: { type: String, maxlength: 10 },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
});

// Teacher Schema
const TeacherSchema = new mongoose.Schema({
  teacher_id: { type: Number, unique: true },
  teach_name: { type: String },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
});

// Student Schema
const StudentSchema = new mongoose.Schema({
  student_id: { type: Number, unique: true },
  year_name: { type: String },
  num_students: { type: Number },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
});

// Subject Schema
const SubjectSchema = new mongoose.Schema({
  subj_id: { type: Number, unique: true },
  subj_name: { type: String },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
});

// Activity Schema
const ActivitySchema = new mongoose.Schema({
  activities_id: { type: Number, unique: true },
  duration: { type: String },
  total_duration: { type: String },
  active: { type: Boolean },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  subj_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
  activity_group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
});

// Building Schema
const BuildingSchema = new mongoose.Schema({
  building_id: { type: Number, unique: true },
  build_name: { type: String },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
});

// Room Schema
const RoomSchema = new mongoose.Schema({
  room_id: { type: Number, unique: true },
  room_name: { type: String, maxlength: 10 },
  capacity: { type: Number },
  building_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Building",
    required: true,
  },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
});

// Constraint Schema
const ConstraintSchema = new mongoose.Schema({
  cons_id: { type: Number, unique: true },
  type: { type: String, maxlength: 6 },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
});

// Time Constraint Schema
const TimeConstraintSchema = new mongoose.Schema({
  time_cons_id: { type: Number, unique: true },
  cons_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Constraint",
    required: true,
  },
  type: { type: String, maxlength: 45 },
});

// Min Days Constraint Schema
const MinDaysConstraintSchema = new mongoose.Schema({
  min_days_cons_id: { type: Number, unique: true },
  weight_percentage: { type: String, maxlength: 5 },
  consecutive_if_same_day: { type: Boolean },
  num_of_activities: { type: Number },
  min_days: { type: String, maxlength: 45 },
  active: { type: String, maxlength: 5 },
  comments: { type: String },
  time_cons_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TimeConstraint",
    required: true,
  },
});

// Min Days for Activities Schema
const MinDaysForActivitiesSchema = new mongoose.Schema({
  MinDays_For_Activitie_id: { type: Number, unique: true },
  min_days_cons_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MinDaysConstraint",
    required: true,
  },
  activities_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: true,
  },
});

// Basic Compulsory Constraints Schema
const BasicCompulsoryConstraintSchema = new mongoose.Schema({
  basic_cons_id: { type: Number, unique: true },
  weight_percentage: { type: String, maxlength: 5 },
  active: { type: String, maxlength: 5 },
  comments: { type: String },
  cons_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Constraint",
    required: true,
  },
});

// Same Start Hour Constraints Schema
const SameStartHrConstraintSchema = new mongoose.Schema({
  same_start_cons_id: { type: Number, unique: true },
  weight_percentage: { type: String, maxlength: 5 },
  num_of_activities: { type: String, maxlength: 45 },
  active: { type: String, maxlength: 5 },
  comments: { type: String, maxlength: 45 },
  time_cons_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TimeConstraint",
    required: true,
  },
});

// Activities Same Start Schema
const ActivitiesSameStartSchema = new mongoose.Schema({
  Activities_Same_Start_id: { type: Number, unique: true },
  same_start_cons_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SameStartHrConstraint",
    required: true,
  },
  activities_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: true,
  },
});

// Space Constraints Schema
const SpaceConstraintSchema = new mongoose.Schema({
  space_cons_id: { type: Number, unique: true },
  weight_percentage: { type: String, maxlength: 45 },
  num_of_pref_rooms: { type: Number },
  active: { type: String, maxlength: 5 },
  comments: { type: String },
  cons_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Constraint",
    required: true,
  },
});

// Preferred Rooms Schema
const PreferredRoomsSchema = new mongoose.Schema({
  pref_rooms_id: { type: Number, unique: true },
  space_cons_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SpaceConstraint",
    required: true,
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
});

// Hours Schema
const HoursSchema = new mongoose.Schema({
  hours_id: { type: Number, unique: true },
  hour_name: { type: String, maxlength: 45 },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
});

// Days Schema
const DaysSchema = new mongoose.Schema({
  days_id: { type: Number, unique: true },
  day_name: { type: String, maxlength: 45 },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
});

// Groups Schema
const GroupSchema = new mongoose.Schema({
  group_id: { type: Number, unique: true },
  year_name: { type: String, maxlength: 45 },
  num_of_students: { type: String, maxlength: 45 },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  user_table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTable",
    required: true,
  },
});

// Apply the Auto-Increment Plugin --->>> npm install mongoose-sequence
UserTableSchema.plugin(AutoIncrement, { inc_field: "user_table_id" });
UserFileSchema.plugin(AutoIncrement, { inc_field: "user_files_id" });
SemesterSchema.plugin(AutoIncrement, { inc_field: "sem_id" });
TeacherSchema.plugin(AutoIncrement, { inc_field: "teacher_id" });
StudentSchema.plugin(AutoIncrement, { inc_field: "student_id" });
SubjectSchema.plugin(AutoIncrement, { inc_field: "subj_id" });
ActivitySchema.plugin(AutoIncrement, { inc_field: "activities_id" });
BuildingSchema.plugin(AutoIncrement, { inc_field: "building_id" });
RoomSchema.plugin(AutoIncrement, { inc_field: "room_id" });
ConstraintSchema.plugin(AutoIncrement, { inc_field: "cons_id" });
TimeConstraintSchema.plugin(AutoIncrement, { inc_field: "time_cons_id" });
MinDaysConstraintSchema.plugin(AutoIncrement, {
  inc_field: "min_days_cons_id",
});
MinDaysForActivitiesSchema.plugin(AutoIncrement, {
  inc_field: "MinDays_For_Activitie_id",
});
BasicCompulsoryConstraintSchema.plugin(AutoIncrement, {
  inc_field: "basic_cons_id",
});
SameStartHrConstraintSchema.plugin(AutoIncrement, {
  inc_field: "same_start_cons_id",
});
ActivitiesSameStartSchema.plugin(AutoIncrement, {
  inc_field: "Activities_Same_Start_id",
});
SpaceConstraintSchema.plugin(AutoIncrement, { inc_field: "space_cons_id" });
PreferredRoomsSchema.plugin(AutoIncrement, { inc_field: "pref_rooms_id" });
HoursSchema.plugin(AutoIncrement, { inc_field: "hours_id" });
DaysSchema.plugin(AutoIncrement, { inc_field: "days_id" });
GroupSchema.plugin(AutoIncrement, { inc_field: "group_id" });

// Models
const User = mongoose.model("User", UserSchema);
const UserTable = mongoose.model("UserTable", UserTableSchema);
const UserFile = mongoose.model("UserFile", UserFileSchema);
const Semester = mongoose.model("Semester", SemesterSchema);
const Teacher = mongoose.model("Teacher", TeacherSchema);
const Student = mongoose.model("Student", StudentSchema);
const Subject = mongoose.model("Subject", SubjectSchema);
const Activity = mongoose.model("Activity", ActivitySchema);
const Building = mongoose.model("Building", BuildingSchema);
const Room = mongoose.model("Room", RoomSchema);
const Constraint = mongoose.model("Constraint", ConstraintSchema);
const TimeConstraint = mongoose.model("TimeConstraint", TimeConstraintSchema);
const MinDaysConstraint = mongoose.model(
  "MinDaysConstraint",
  MinDaysConstraintSchema
);
const MinDaysForActivities = mongoose.model(
  "MinDaysForActivities",
  MinDaysForActivitiesSchema
);
const BasicCompulsoryConstraint = mongoose.model(
  "BasicCompulsoryConstraint",
  BasicCompulsoryConstraintSchema
);
const SameStartHrConstraint = mongoose.model(
  "SameStartHrConstraint",
  SameStartHrConstraintSchema
);
const ActivitiesSameStart = mongoose.model(
  "ActivitiesSameStart",
  ActivitiesSameStartSchema
);
const SpaceConstraint = mongoose.model(
  "SpaceConstraint",
  SpaceConstraintSchema
);
const PreferredRooms = mongoose.model("PreferredRooms", PreferredRoomsSchema);
const Hours = mongoose.model("Hours", HoursSchema);
const Days = mongoose.model("Days", DaysSchema);
const Group = mongoose.model("Group", GroupSchema);

// Export All Models
module.exports = {
  User,
  UserTable,
  UserFile,
  Semester,
  Teacher,
  Student,
  Subject,
  Activity,
  Building,
  Room,
  Constraint,
  TimeConstraint,
  MinDaysConstraint,
  MinDaysForActivities,
  BasicCompulsoryConstraint,
  SameStartHrConstraint,
  ActivitiesSameStart,
  SpaceConstraint,
  PreferredRooms,
  Hours,
  Days,
  Group,
};
