// // services/timetableGenerator.ts
// import Lecture from "../models/Lecture";
// import ILecture from "../models/Lecture";
// import Room from "../models/Room";
// import { IRoom } from "../models/Room";
// import Teacher from "../models/Teacher";
// import ITeacher from "../models/Teacher";
// import Student from "../models/Student";
// import TimeAllocation from "../models/TimeAllocation";
// import ITimeAllocation from "../models/TimeAllocation";
// import { Timetable } from "../models/TimeTable";
// import { ITimetable } from "../models/TimeTable";
// import IStudent from "../models/Student";
// import { DateTime, Interval } from "luxon";
// import mongoose from "mongoose";

// type TimeSlot = {
//   start: DateTime;
//   end: DateTime;
//   day: string;
// };

// type SchedulingContext = {
//   teacherHours: Map<string, number>;
//   roomBookings: Map<string, TimeSlot[]>;
//   studentCommitments: Map<string, TimeSlot[]>;
//   timeSlots: TimeSlot[];
// };

// export class TimetableGenerator {
//   private async initializeContext(
//     year: string,
//     semester: string
//   ): Promise<SchedulingContext> {
//     const timeAllocation = await TimeAllocation.findOne({
//       "id.year": year,
//       "id.semester": semester,
//     }).lean();

//     if (!timeAllocation) {
//       throw new Error("Time allocation not found for given year/semester");
//     }

//     return {
//       teacherHours: new Map(),
//       roomBookings: new Map(),
//       studentCommitments: new Map(),
//       timeSlots: this.generateTimeSlots(timeAllocation),
//     };
//   }

//   private generateTimeSlots(timeAllocation: any): TimeSlot[] {
//     const slots: TimeSlot[] = [];
//     const settings = timeAllocation.settings;
//     const days = [
//       ...Object.entries(timeAllocation.weekdays || {}),
//       ...Object.entries(timeAllocation.weekends || {}),
//     ];

//     for (const [day, daySlots] of days) {
//       const isWeekend = day in (timeAllocation.weekends || {});
//       const startTime = DateTime.fromFormat(
//         isWeekend ? settings.weekendStartTime : settings.weekdayStartTime,
//         "HH:mm"
//       );
//       const endTime = DateTime.fromFormat(
//         isWeekend ? settings.weekendEndTime : settings.weekdayEndTime,
//         "HH:mm"
//       );

//       let current = startTime;
//       while (current < endTime) {
//         const slotEnd = current.plus({ minutes: settings.slotDuration });
//         if (slotEnd > endTime) break;

//         slots.push({
//           start: current,
//           end: slotEnd,
//           day: day,
//         });

//         current = slotEnd;
//       }
//     }

//     return slots;
//   }

//   private getStudentBatches(lecture: ILecture): Promise<string[]> {
//     return Student.distinct("batch", {
//       courses: lecture.courseCode,
//       year: lecture.year,
//       semester: lecture.semester,
//     }).exec();
//   }

//   private async findSuitableRooms(lecture: ILecture): Promise<IRoom[]> {
//     return Room.find({
//       capacity: { $gte: lecture.capacity },
//       type: lecture.type === "lab" ? 2 : lecture.type === "tutorial" ? 1 : 0,
//       department: lecture.department,
//       availability: "Available",
//     }).exec();
//   }

//   private hasOverlap(a: TimeSlot, b: TimeSlot): boolean {
//     return a.day === b.day && a.start < b.end && a.end > b.start;
//   }

//   private canScheduleLecture(
//     lecture: ILecture,
//     room: IRoom,
//     slot: TimeSlot,
//     batches: string[],
//     context: SchedulingContext
//   ): boolean {
//     // Check teacher availability
//     const teacherHours =
//       context.teacherHours.get(lecture.teacherId.toString()) || 0;
//     if (
//       teacherHours + lecture.duration >
//       (lecture.teacher.maxHoursPerWeek || 0)
//     ) {
//       return false;
//     }

//     // Check room availability
//     const roomBookings = context.roomBookings.get(room._id.toString()) || [];
//     if (roomBookings.some((booking) => this.hasOverlap(booking, slot))) {
//       return false;
//     }

//     // Check student conflicts
//     for (const batch of batches) {
//       const studentSlots = context.studentCommitments.get(batch) || [];
//       if (studentSlots.some((s) => this.hasOverlap(s, slot))) {
//         return false;
//       }
//     }

//     return true;
//   }

//   private updateContext(
//     lecture: ILecture,
//     room: IRoom,
//     slot: TimeSlot,
//     batches: string[],
//     context: SchedulingContext
//   ) {
//     // Update teacher hours
//     const teacherHours =
//       context.teacherHours.get(lecture.teacherId.toString()) || 0;
//     context.teacherHours.set(
//       lecture.teacherId.toString(),
//       teacherHours + lecture.duration
//     );

//     // Update room bookings
//     const roomBookings = context.roomBookings.get(room._id.toString()) || [];
//     roomBookings.push(slot);
//     context.roomBookings.set(room._id.toString(), roomBookings);

//     // Update student commitments
//     for (const batch of batches) {
//       const studentSlots = context.studentCommitments.get(batch) || [];
//       studentSlots.push(slot);
//       context.studentCommitments.set(batch, studentSlots);
//     }
//   }

//   public async generateTimetable(
//     institution: string,
//     year: string,
//     semester: string
//   ): Promise<ITimetable> {
//     const [lectures, teachers] = await Promise.all([
//       Lecture.find({ year, semester }).populate("teacherId").exec(),
//       Teacher.find().exec(),
//     ]);

//     const context = await this.initializeContext(year, semester);
//     const timetable = new Timetable({
//       institution,
//       year,
//       semester,
//       entries: [],
//     });

//     // Sort lectures by priority (labs first, then capacity descending)
//     const sortedLectures = lectures.sort((a, b) => {
//       if (a.type === "lab" && b.type !== "lab") return -1;
//       if (b.type === "lab" && a.type !== "lab") return 1;
//       return b.capacity - a.capacity;
//     });

//     for (const lecture of sortedLectures) {
//       const batches = await this.getStudentBatches(lecture);
//       const suitableRooms = await this.findSuitableRooms(lecture);

//       for (const slot of context.timeSlots) {
//         for (const room of suitableRooms) {
//           if (this.canScheduleLecture(lecture, room, slot, batches, context)) {
//             // Create timetable entry
//             timetable.entries.push({
//               lecture: lecture._id,
//               room: room._id,
//               teacher: lecture.teacherId._id,
//               startTime: slot.start.toJSDate(),
//               endTime: slot.end.toJSDate(),
//               day: slot.day,
//               studentBatches: batches,
//             });

//             this.updateContext(lecture, room, slot, batches, context);
//             break;
//           }
//         }
//       }
//     }

//     // Validate all lectures were scheduled
//     const unscheduled: ILecture[] = sortedLectures.filter(
//       (l: ILecture) =>
//         !timetable.entries.some((e: { lecture: mongoose.Types.ObjectId }) =>
//           e.lecture.equals(l._id)
//         )
//     );

//     if (unscheduled.length > 0) {
//       throw new Error(
//         `Could not schedule ${unscheduled.length} lectures: ${unscheduled
//           .map((l) => l.name)
//           .join(", ")}`
//       );
//     }

//     return timetable.save();
//   }
// }
