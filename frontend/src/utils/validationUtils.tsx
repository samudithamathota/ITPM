export interface ValidationError {
  field: string;
  message: string;
}
export interface TimetableValidation {
  isValid: boolean;
  errors: ValidationError[];
}
export const validateTimetableData = (timetable: any): TimetableValidation => {
  const errors: ValidationError[] = [];
  if (!timetable || typeof timetable !== "object") {
    errors.push({
      field: "timetable",
      message: "Invalid timetable data structure",
    });
    return { isValid: false, errors };
  }
  // Validate days structure
  const days = Object.keys(timetable);
  const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  days.forEach((day) => {
    if (!validDays.includes(day)) {
      errors.push({
        field: "days",
        message: `Invalid day found: ${day}`,
      });
    }
    // Validate time slots
    const slots = timetable[day];
    if (slots && typeof slots === "object") {
      Object.entries(slots).forEach(([time, session]: [string, any]) => {
        // Validate time format
        if (!/^([0-9]|1[0-2]):[0-9]{2} [AP]M$/.test(time)) {
          errors.push({
            field: "timeFormat",
            message: `Invalid time format: ${time}`,
          });
        }
        // Validate session data
        if (session && typeof session === "object") {
          if (!session.course) {
            errors.push({
              field: "course",
              message: `Missing course name for ${day} at ${time}`,
            });
          }
          if (!session.teacher) {
            errors.push({
              field: "teacher",
              message: `Missing teacher for ${day} at ${time}`,
            });
          }
          if (!session.room) {
            errors.push({
              field: "room",
              message: `Missing room for ${day} at ${time}`,
            });
          }
        }
      });
    }
  });
  return {
    isValid: errors.length === 0,
    errors,
  };
};
export const validateDownloadFormat = (format: string): boolean => {
  const validFormats = ["pdf", "excel", "csv"];
  return validFormats.includes(format);
};
export const validateTimetableName = (name: string): ValidationError | null => {
  if (!name || name.trim().length === 0) {
    return {
      field: "name",
      message: "Timetable name is required",
    };
  }
  if (name.length > 100) {
    return {
      field: "name",
      message: "Timetable name is too long (max 100 characters)",
    };
  }
  if (!/^[a-zA-Z0-9\s_-]+$/.test(name)) {
    return {
      field: "name",
      message: "Timetable name contains invalid characters",
    };
  }
  return null;
};
export const validateTimeSlotConflicts = (
  timetable: any,
  day: string,
  time: string,
  teacher: string
): ValidationError[] => {
  const errors: ValidationError[] = [];
  // Check if teacher is already scheduled at this time on other days
  Object.entries(timetable).forEach(([currentDay, slots]: [string, any]) => {
    if (slots[time] && slots[time].teacher === teacher && currentDay !== day) {
      errors.push({
        field: "teacherConflict",
        message: `Teacher ${teacher} is already scheduled at ${time} on ${currentDay}`,
      });
    }
  });
  // Check for consecutive slots without breaks
  const timeSlots = Object.keys(timetable[day] || {}).sort();
  const currentIndex = timeSlots.indexOf(time);
  if (currentIndex > 0) {
    // Check previous slot
    const prevSlot = timeSlots[currentIndex - 1];
    if (timetable[day][prevSlot]?.teacher === teacher) {
      errors.push({
        field: "consecutiveSlots",
        message: `Teacher ${teacher} has consecutive classes without break`,
      });
    }
  }
  return errors;
};
