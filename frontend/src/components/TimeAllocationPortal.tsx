import { useState, useEffect, useCallback } from "react";
import { PlusIcon, SaveIcon } from "lucide-react";
import { API } from "../services/api";

interface Schedule {
  [day: string]: {
    [timeSlot: string]: boolean;
  };
}

interface TimeRange {
  start: string;
  end: string;
  available: boolean;
}

interface TimeAllocationPayload {
  allocationKey: {
    year: string;
    semester: string;
  };
  weekdays?: {
    [day: string]: {
      availableSlots: string[];
      unavailableSlots: string[];
    };
  };
  weekends?: {
    [day: string]: {
      availableSlots: string[];
      unavailableSlots: string[];
    };
  };
  settings: {
    slotDuration: number;
    weekdayStartTime: string;
    weekdayEndTime: string;
    weekendStartTime: string;
    weekendEndTime: string;
  };
}

const TimeAllocationPortal = () => {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const weekendDays = ["Saturday", "Sunday"];

  const durationOptions = [
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
    { value: 150, label: "2.5 hours" },
    { value: 180, label: "3 hours" },
  ];

  const yearOptions = [
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
  ];

  const semesterOptions = [
    { value: 1, label: "Semester 1" },
    { value: 2, label: "Semester 2" },
  ];

  // State
  const [isWeekday, setIsWeekday] = useState<boolean>(true);
  const [days, setDays] = useState<string[]>(weekDays);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>({
    start: "08:00",
    end: "22:00",
    available: true,
  });
  const [duration, setDuration] = useState<number>(60);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("1st Year");
  const [selectedSemester, setSelectedSemester] =
    useState<string>("Semester 1");

  // Utility functions
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  const generateTimeSlots = (
    start: string,
    end: string,
    duration: number
  ): string[] => {
    if (timeToMinutes(end) <= timeToMinutes(start)) return []; // Prevent infinite loops

    const slots: string[] = [];
    let currentTime = timeToMinutes(start);
    const endTime = timeToMinutes(end);

    while (currentTime + duration <= endTime) {
      const slotStart = minutesToTime(currentTime);
      const slotEnd = minutesToTime(currentTime + duration);
      slots.push(`${slotStart} - ${slotEnd}`);
      currentTime += duration;
    }

    return slots;
  };

  // Initialize time slots
  useEffect(() => {
    const slots = generateTimeSlots(
      selectedTimeRange.start,
      selectedTimeRange.end,
      duration
    );
    console.log("Generated Time Slots:", slots);
    setTimeSlots(slots);
  }, [selectedTimeRange.start, selectedTimeRange.end, duration]);

  // Initialize schedule
  const initializeSchedule = (daysArray: string[]) => {
    const newSchedule: Schedule = daysArray.reduce(
      (acc: Schedule, day: string) => {
        acc[day] = timeSlots.reduce(
          (slotAcc: { [key: string]: boolean }, slot: string) => {
            slotAcc[slot] = true;
            return slotAcc;
          },
          {}
        );
        return acc;
      },
      {} as Schedule
    );

    setSchedule(newSchedule);
    if (!daysArray.includes(selectedDay)) {
      setSelectedDay(daysArray[0]);
    }
  };

  useEffect(() => {
    if (timeSlots.length > 0) {
      initializeSchedule(days);
    }
  }, [days, timeSlots]);

  // Load schedule for selected year
  const loadScheduleForYear = async (year: string) => {
    try {
      const data = await API.getTimeAllocation(year, selectedSemester);
      console.log("API Response Data:", data);

      if (data) {
        const loadedSchedule: Schedule = {};

        if (data.weekdays) {
          Object.entries(data.weekdays).forEach(([day, slots]) => {
            loadedSchedule[day] = loadedSchedule[day] || {};
            slots.availableSlots.forEach((slot) => {
              loadedSchedule[day][slot] = true;
            });
            slots.unavailableSlots.forEach((slot) => {
              loadedSchedule[day][slot] = false;
            });
          });
        }

        if (data.weekends) {
          Object.entries(data.weekends).forEach(([day, slots]) => {
            loadedSchedule[day] = loadedSchedule[day] || {};
            slots.availableSlots.forEach((slot) => {
              loadedSchedule[day][slot] = true;
            });
            slots.unavailableSlots.forEach((slot) => {
              loadedSchedule[day][slot] = false;
            });
          });
        }

        setSchedule(loadedSchedule);
        console.log("Loaded Schedule:", loadedSchedule);

        if (data.settings) {
          setDuration(data.settings.slotDuration);
          setSelectedTimeRange({
            start: data.settings.weekdayStartTime,
            end: data.settings.weekdayEndTime,
            available: true,
          });
        }
      }
    } catch (error) {
      console.error("Error loading schedule:", error);
      setSaveMessage({
        text: "Error loading schedule",
        type: "error",
      });
    }
  };

  useEffect(() => {
    loadScheduleForYear(selectedYear);
  }, [selectedYear]);

  // Event handlers
  const handleWeekdayToggle = (isWeekdaySelected: boolean) => {
    setIsWeekday(isWeekdaySelected);
    const newDays = isWeekdaySelected ? weekDays : weekendDays;
    setDays(newDays);
    setSelectedDay(newDays[0]);

    const newSchedule: Schedule = { ...schedule };
    newDays.forEach((day) => {
      if (!newSchedule[day]) {
        newSchedule[day] = {};
        timeSlots.forEach((slot) => {
          newSchedule[day][slot] = true;
        });
      }
    });
    setSchedule(newSchedule);
    console.log("Schedule after weekday toggle:", newSchedule);
  };

  const handleSlotToggle = useCallback((day: string, slot: string) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: {
        ...prevSchedule[day],
        [slot]: !prevSchedule[day][slot],
      },
    }));
  }, []);

  const handleApplyTimeRange = () => {
    const updatedSchedule: Schedule = { ...schedule };

    // Ensure the selectedDay is initialized in the schedule
    if (!updatedSchedule[selectedDay]) {
      updatedSchedule[selectedDay] = {};
    }

    timeSlots.forEach((slot) => {
      updatedSchedule[selectedDay][slot] = selectedTimeRange.available;
    });

    setSchedule(updatedSchedule);
    console.log("Schedule after applying time range:", updatedSchedule);
  };

  const handleClearAll = () => {
    const clearedSchedule: Schedule = { ...schedule };
    days.forEach((day: string) => {
      timeSlots.forEach((slot: string) => {
        clearedSchedule[day][slot] = false;
      });
    });
    setSchedule(clearedSchedule);
    console.log("Cleared Schedule:", clearedSchedule);
  };

  const handleSetAllAvailable = () => {
    const availableSchedule: Schedule = { ...schedule };
    days.forEach((day: string) => {
      timeSlots.forEach((slot: string) => {
        availableSchedule[day][slot] = true;
      });
    });
    setSchedule(availableSchedule);
    console.log("All Available Schedule:", availableSchedule);
  };

  // Save handler
  const handleSaveSchedule = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const payload: TimeAllocationPayload = {
        allocationKey: { year: selectedYear, semester: selectedSemester },
        settings: {
          slotDuration: duration,
          weekdayStartTime: selectedTimeRange.start,
          weekdayEndTime: selectedTimeRange.end,
          weekendStartTime: selectedTimeRange.start,
          weekendEndTime: selectedTimeRange.end,
        },
        weekdays: isWeekday ? {} : undefined,
        weekends: !isWeekday ? {} : undefined,
      };

      const targetDays = isWeekday ? weekDays : weekendDays;
      targetDays.forEach((day) => {
        if (schedule[day]) {
          const dayData = {
            availableSlots: Object.entries(schedule[day])
              .filter(([_, isAvailable]) => isAvailable)
              .map(([slot]) => slot),
            unavailableSlots: Object.entries(schedule[day])
              .filter(([_, isAvailable]) => !isAvailable)
              .map(([slot]) => slot),
          };
          if (isWeekday) payload.weekdays![day] = dayData;
          else payload.weekends![day] = dayData;
        }
      });

      console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

      await API.saveTimeAllocation(payload);
      setSaveMessage({
        text: `Schedule for ${selectedYear} saved successfully!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error saving schedule:", error);
      setSaveMessage({ text: "Error saving schedule", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    console.log("Schedule state updated:", schedule);
  }, [schedule]);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Time Allocation</h1>
        <p className="mt-1 text-gray-600">
          Configure available time slots for timetable generation
        </p>
      </div>

      {saveMessage && (
        <div
          className={`mb-4 p-4 rounded-md ${
            saveMessage.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Time Range Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Year
            </label>
            <select
              id="year"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {yearOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="semester"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Semester
            </label>
            <select
              id="semester"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {semesterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Time Slot Duration
            </label>
            <select
              id="duration"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="day"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Day
            </label>
            <select
              id="day"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Schedule Start Time
            </label>
            <input
              type="time"
              id="startTime"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedTimeRange.start}
              onChange={(e) =>
                setSelectedTimeRange({
                  ...selectedTimeRange,
                  start: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Schedule End Time
            </label>
            <input
              type="time"
              id="endTime"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedTimeRange.end}
              onChange={(e) =>
                setSelectedTimeRange({
                  ...selectedTimeRange,
                  end: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-purple-600"
              name="week"
              checked={isWeekday}
              onChange={() => handleWeekdayToggle(true)}
            />
            <span className="ml-2 text-gray-700">WeekDay</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              className="form-radio text-purple-600"
              name="week"
              checked={!isWeekday}
              onChange={() => handleWeekdayToggle(false)}
            />
            <span className="ml-2 text-gray-700">Weekend</span>
          </label>
        </div>

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-purple-600"
              name="availability"
              checked={selectedTimeRange.available}
              onChange={() =>
                setSelectedTimeRange({
                  ...selectedTimeRange,
                  available: true,
                })
              }
            />
            <span className="ml-2 text-gray-700">Available</span>
          </label>
          <label className="inline-flex items-center ml-6">
            <input
              type="radio"
              className="form-radio text-purple-600"
              name="availability"
              checked={!selectedTimeRange.available}
              onChange={() =>
                setSelectedTimeRange({
                  ...selectedTimeRange,
                  available: false,
                })
              }
            />
            <span className="ml-2 text-gray-700">Unavailable</span>
          </label>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleApplyTimeRange}
            className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center hover:bg-purple-700 transition-colors"
          >
            <PlusIcon size={18} className="mr-2" /> Apply Time Range
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Time Availability Schedule
          </h2>
          <div>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 mr-2"
            >
              Clear All
            </button>
            <button
              onClick={handleSetAllAvailable}
              className="px-4 py-2 text-green-600 border border-green-300 rounded-md hover:bg-green-50"
            >
              Set All Available
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlots.map((slot) => (
                <tr key={slot}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {slot}
                  </td>
                  {days.map((day) => (
                    <td
                      key={`${day}-${slot}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleSlotToggle(day, slot)}
                          className={`w-6 h-6 rounded-full ${
                            schedule[day]?.[slot]
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          } focus:outline-none`}
                        >
                          {schedule[day]?.[slot] ? "✓" : "✕"}
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveSchedule}
            disabled={isSaving}
            className={`px-4 py-2 bg-purple-600 text-white rounded-md flex items-center hover:bg-purple-700 transition-colors ${
              isSaving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <SaveIcon size={18} className="mr-2" />
            {isSaving ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeAllocationPortal;
