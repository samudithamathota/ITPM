import { useState } from "react";
import { PlusIcon, SaveIcon } from "lucide-react";

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

const TimeAllocationPortal = () => {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const weekendDays = ["Saturday", "Sunday"];
  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9.00 PM",
    "10.00 PM",
  ];

  const [isWeekday, setIsWeekday] = useState<boolean>(true);
  const [days, setDays] = useState<string[]>(weekDays);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>({
    start: "8:00 AM",
    end: "9:00 AM",
    available: true,
  });

  // Initialize schedule based on current days (weekdays or weekends)
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

  // Initialize schedule on first render
  useState(() => {
    initializeSchedule(days);
  });

  const handleWeekdayToggle = (isWeekdaySelected: boolean) => {
    setIsWeekday(isWeekdaySelected);
    const newDays = isWeekdaySelected ? weekDays : weekendDays;
    setDays(newDays);
    initializeSchedule(newDays);
  };

  const handleSlotToggle = (day: string, slot: string) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [slot]: !schedule[day][slot],
      },
    });
  };

  const handleApplyTimeRange = () => {
    const startIndex = timeSlots.indexOf(selectedTimeRange.start);
    const endIndex = timeSlots.indexOf(selectedTimeRange.end);
    if (startIndex > -1 && endIndex > -1 && startIndex <= endIndex) {
      const updatedSchedule: Schedule = {
        ...schedule,
      };
      for (let i = startIndex; i <= endIndex; i++) {
        updatedSchedule[selectedDay][timeSlots[i]] =
          selectedTimeRange.available;
      }
      setSchedule(updatedSchedule);
    }
  };

  const handleClearAll = () => {
    const clearedSchedule: Schedule = {
      ...schedule,
    };
    days.forEach((day: string) => {
      timeSlots.forEach((slot: string) => {
        clearedSchedule[day][slot] = false;
      });
    });
    setSchedule(clearedSchedule);
  };

  const handleSetAllAvailable = () => {
    const availableSchedule: Schedule = {
      ...schedule,
    };
    days.forEach((day: string) => {
      timeSlots.forEach((slot: string) => {
        availableSchedule[day][slot] = true;
      });
    });
    setSchedule(availableSchedule);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Time Allocation</h1>
        <p className="mt-1 text-gray-600">
          Configure available time slots for timetable generation
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Time Range Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Time
            </label>
            <select
              id="startTime"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedTimeRange.start}
              onChange={(e) =>
                setSelectedTimeRange({
                  ...selectedTimeRange,
                  start: e.target.value,
                })
              }
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Time
            </label>
            <select
              id="endTime"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedTimeRange.end}
              onChange={(e) =>
                setSelectedTimeRange({
                  ...selectedTimeRange,
                  end: e.target.value,
                })
              }
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
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
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center hover:bg-purple-700 transition-colors">
            <SaveIcon size={18} className="mr-2" /> Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeAllocationPortal;
