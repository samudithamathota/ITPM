// // services/timetableService.ts
// import mongoose, { Types, Document, ObjectId } from "mongoose";
// import Lecture from "../models/Lecture";
// import Room from "../models/Room";
// import Teacher from "../models/Teacher";
// import Student from "../models/Student";
// import TimeAllocationModel from "../models/TimeAllocation";
// import Timetable from "../models/TimeTable";

// // Define local interfaces since models might not export them
// interface ILecture extends Document {
//   name: string;
//   courseCode: string;
//   teacherId: Types.ObjectId;
//   duration?: number;
//   type?: "lecture" | "lab" | "tutorial";
//   capacity?: number;
// }

// interface IRoom extends Document {
//   name: string;
//   building: string;
//   department: string;
//   capacity: number;
//   availability: string;
//   type: number;
// }

// interface ITeacher extends Document {
//   name: string;
//   email: string;
//   department: string;
//   specialization?: string;
//   maxHoursPerWeek?: number;
//   seniority?: "junior" | "senior" | "head";
//   building?: string;
// }

// interface IStudent extends Document {
//   batch: string;
//   courses: string[];
//   count: number;
//   year: string;
//   semester: string;
//   department: string;
// }

// interface ITimetableEntry {
//   lectureId: Types.ObjectId;
//   roomId: Types.ObjectId;
//   teacherId: Types.ObjectId;
//   studentBatch: string;
//   startTime: Date;
//   endTime: Date;
//   date: Date;
// }

// interface ITimetable extends Document {
//   institution: string;
//   year: string;
//   semester: string;
//   entries: ITimetableEntry[];
// }

// interface GenerateTimetableParams {
//   year: string;
//   semester: string;
//   institution: string;
//   startDate: Date;
//   endDate: Date;
// }

// interface ScheduledSlot {
//   startTime: Date;
//   endTime: Date;
//   date: Date;
//   room: Types.ObjectId;
//   teacherId?: Types.ObjectId;
//   studentBatch?: string;
// }

// interface TimeSlot {
//   start: Date;
//   end: Date;
//   date: Date;
// }

// export const generateTimetable = async (params: GenerateTimetableParams) => {
//   const { year, semester, institution, startDate, endDate } = params;

//   // Fetch all required data
//   const [lectures, rooms, students, teachers, timeAllocation] =
//     await Promise.all([
//       Lecture.find({}),
//       Room.find({}),
//       Student.find({ year, semester }),
//       Teacher.find({}),
//       TimeAllocationModel.findOne({ "id.year": year, "id.semester": semester }),
//     ]);

//   if (!timeAllocation) throw new Error("Time allocation settings not found");

//   // Generate time slots based on settings
//   const timeSlots = generateTimeSlots(
//     timeAllocation.settings,
//     startDate,
//     endDate
//   );

//   // Create timetable structure
//   const timetable = new Timetable({
//     institution,
//     year,
//     semester,
//     entries: [],
//   });

//   // Track scheduled entities
//   const scheduledSlots: ScheduledSlot[] = [];

//   // Main scheduling logic
//   for (const lecture of lectures) {
//     const teacher = teachers.find((t) =>
//       t.id.equals(lecture.teacherId as ObjectId)
//     );
//     if (!teacher)
//       throw new Error(`Teacher not found for lecture ${lecture.courseCode}`);

//     const studentBatch = students.find((s) =>
//       s.courses.includes(lecture.courseCode)
//     )?.batch;

//     if (!studentBatch) {
//       console.warn(`No student batch found for course ${lecture.courseCode}`);
//       continue;
//     }

//     const suitableRooms = rooms.filter(
//       (room) =>
//         room.capacity >= (lecture.capacity || 0) &&
//         room.type === (lecture.type === "lab" ? 2 : 1)
//     );

//     if (suitableRooms.length === 0) {
//       console.warn(`No suitable rooms found for ${lecture.name}`);
//       continue;
//     }

//     // Find available slot
//     const slot = findAvailableSlot({
//       lecture,
//       teacher,
//       studentBatch,
//       suitableRooms,
//       timeSlots,
//       scheduledSlots,
//       timeAllocation: timeAllocation.settings,
//     });

//     if (slot) {
//       const timetableEntry: ITimetableEntry = {
//         lectureId: lecture._id as Types.ObjectId,
//         roomId: slot.room,
//         teacherId: teacher._id as Types.ObjectId,
//         studentBatch,
//         startTime: slot.startTime,
//         endTime: slot.endTime,
//         date: slot.date,
//       };

//       timetable.entries.push(timetableEntry);
//       scheduledSlots.push({
//         room: slot.room,
//         date: slot.date,
//         startTime: slot.startTime,
//         endTime: slot.endTime,
//         teacherId: teacher._id as Types.ObjectId,
//         studentBatch,
//       });
//     }
//   }

//   // Save the generated timetable
//   return await timetable.save();
// };

// // Generate time slots for the scheduling period
// const generateTimeSlots = (
//   settings: any, // Replace with proper type if available
//   startDate: Date,
//   endDate: Date
// ): TimeSlot[] => {
//   const slots: TimeSlot[] = [];
//   const currentDate = new Date(startDate);

//   while (currentDate <= endDate) {
//     const dayOfWeek = currentDate.getDay();
//     const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

//     const daySettings = {
//       start: isWeekend ? settings.weekendStartTime : settings.weekdayStartTime,
//       end: isWeekend ? settings.weekendEndTime : settings.weekdayEndTime,
//     };

//     const [startHour, startMinute] = daySettings.start.split(":").map(Number);
//     const [endHour, endMinute] = daySettings.end.split(":").map(Number);

//     let currentTime = new Date(currentDate);
//     currentTime.setHours(startHour, startMinute, 0, 0);

//     const endTime = new Date(currentDate);
//     endTime.setHours(endHour, endMinute, 0, 0);

//     while (currentTime < endTime) {
//       const slotEnd = new Date(currentTime);
//       slotEnd.setMinutes(currentTime.getMinutes() + settings.slotDuration);

//       if (slotEnd > endTime) break;

//       slots.push({
//         date: new Date(currentDate),
//         start: new Date(currentTime),
//         end: new Date(slotEnd),
//       });

//       currentTime = slotEnd;
//     }

//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   return slots;
// };

// // Find available slot with constraints
// const findAvailableSlot = (params: {
//   lecture: ILecture;
//   teacher: ITeacher;
//   studentBatch: string;
//   suitableRooms: IRoom[];
//   timeSlots: TimeSlot[];
//   scheduledSlots: ScheduledSlot[];
//   timeAllocation: any; // Replace with proper type if available
// }): {
//   startTime: Date;
//   endTime: Date;
//   date: Date;
//   room: Types.ObjectId;
// } | null => {
//   const requiredDuration = params.lecture.duration || 60;
//   const requiredSlots = Math.ceil(
//     requiredDuration / params.timeAllocation.slotDuration
//   );

//   for (const timeSlot of params.timeSlots) {
//     // Check if slot is within teacher's working hours
//     if (!isTeacherAvailable(params.teacher, timeSlot, params.scheduledSlots))
//       continue;

//     // Check student batch availability
//     if (
//       hasStudentBatchConflict(
//         params.studentBatch,
//         timeSlot,
//         params.scheduledSlots
//       )
//     )
//       continue;

//     // Find suitable room
//     const availableRoom = params.suitableRooms.find((room) =>
//       isRoomAvailable(room, timeSlot, params.scheduledSlots)
//     );

//     if (availableRoom) {
//       return {
//         startTime: timeSlot.start,
//         endTime: new Date(
//           timeSlot.start.getTime() + requiredDuration * 60 * 1000
//         ),
//         date: timeSlot.date,
//         room: availableRoom._id as Types.ObjectId,
//       };
//     }
//   }

//   return null;
// };

// // Helper functions
// const isTeacherAvailable = (
//   teacher: ITeacher,
//   slot: TimeSlot,
//   scheduledSlots: ScheduledSlot[]
// ): boolean => {
//   const teacherSlots = scheduledSlots.filter(
//     (s) => s.teacherId && s.teacherId.equals(teacher._id as Types.ObjectId)
//   );

//   // Check weekly hour limit
//   const weeklyHours = teacherSlots.reduce((acc, s) => {
//     const duration =
//       (s.endTime.getTime() - s.startTime.getTime()) / (1000 * 60 * 60);
//     return acc + duration;
//   }, 0);

//   if (
//     weeklyHours +
//       (slot.end.getTime() - slot.start.getTime()) / (1000 * 60 * 60) >
//     (teacher.maxHoursPerWeek || 40)
//   ) {
//     return false;
//   }

//   // Check time conflict
//   return !teacherSlots.some(
//     (s) =>
//       slot.date.toDateString() === s.date.toDateString() &&
//       slot.start < s.endTime &&
//       slot.end > s.startTime
//   );
// };

// const isRoomAvailable = (
//   room: IRoom,
//   slot: TimeSlot,
//   scheduledSlots: ScheduledSlot[]
// ): boolean => {
//   return !scheduledSlots.some(
//     (s) =>
//       s.room.equals(room._id as Types.ObjectId) &&
//       slot.date.toDateString() === s.date.toDateString() &&
//       slot.start < s.endTime &&
//       slot.end > s.startTime
//   );
// };

// const hasStudentBatchConflict = (
//   studentBatch: string,
//   slot: TimeSlot,
//   scheduledSlots: ScheduledSlot[]
// ): boolean => {
//   return scheduledSlots.some(
//     (s) =>
//       s.studentBatch === studentBatch &&
//       slot.date.toDateString() === s.date.toDateString() &&
//       slot.start < s.endTime &&
//       slot.end > s.startTime
//   );
// };
