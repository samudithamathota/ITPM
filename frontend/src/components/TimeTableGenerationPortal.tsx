import React, { useEffect, useState } from "react";
import {
  PlayIcon,
  DownloadIcon,
  RefreshCwIcon,
  CheckIcon,
  AlertTriangleIcon,
} from "lucide-react";
import DownloadModal from "./DownloadModal";
import {
  downloadAsPDF,
  downloadAsExcel,
  downloadAsCSV,
} from "../utils/downloadUtils";
import { validateTimetableName } from "../utils/validationUtils";

interface TimetableGenerationPortalProps {
  autoStartGeneration?: boolean;
  onMount?: () => void;
}

interface TimetableSession {
  course: string;
  teacher: string;
  room: string;
}

interface DayTimetable {
  [time: string]: TimetableSession | undefined;
}

interface Timetable {
  [day: string]: DayTimetable;
  Monday: DayTimetable;
  Tuesday: DayTimetable;
  Wednesday: DayTimetable;
  Thursday: DayTimetable;
  Friday: DayTimetable;
}

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

const TimetableGenerationPortal = ({
  autoStartGeneration = false,
  onMount,
}: TimetableGenerationPortalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("settings");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [timetableName, setTimetableName] = useState("Fall Semester 2023");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showAddConstraintForm, setShowAddConstraintForm] = useState(false);
  const [newConstraint, setNewConstraint] = useState({
    type: "Teacher",
    name: "",
    constraint: "",
  });

  const daysOfWeek: DayOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
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
  ];

  const [timetable, setTimetable] = useState<Timetable>({
    Monday: {
      "8:00 AM": {
        course: "Data Structures",
        teacher: "Dr. Sarah Johnson",
        room: "CS-101",
      },
      "10:00 AM": {
        course: "Calculus I",
        teacher: "Prof. Michael Chen",
        room: "MATH-201",
      },
      "1:00 PM": {
        course: "Quantum Physics",
        teacher: "Dr. James Wilson",
        room: "PHYS-301",
      },
    },
    Tuesday: {
      "9:00 AM": {
        course: "Algorithms",
        teacher: "Dr. Sarah Johnson",
        room: "CS-102",
      },
      "11:00 AM": {
        course: "Linear Algebra",
        teacher: "Prof. Michael Chen",
        room: "MATH-202",
      },
      "2:00 PM": {
        course: "Mechanics",
        teacher: "Dr. James Wilson",
        room: "PHYS-302",
      },
    },
    Wednesday: {
      "8:00 AM": {
        course: "Data Structures",
        teacher: "Dr. Sarah Johnson",
        room: "CS-101",
      },
      "11:00 AM": {
        course: "Calculus I",
        teacher: "Prof. Michael Chen",
        room: "MATH-201",
      },
      "3:00 PM": {
        course: "Quantum Physics",
        teacher: "Dr. James Wilson",
        room: "PHYS-301",
      },
    },
    Thursday: {
      "9:00 AM": {
        course: "Algorithms",
        teacher: "Dr. Sarah Johnson",
        room: "CS-102",
      },
      "1:00 PM": {
        course: "Linear Algebra",
        teacher: "Prof. Michael Chen",
        room: "MATH-202",
      },
      "3:00 PM": {
        course: "Mechanics",
        teacher: "Dr. James Wilson",
        room: "PHYS-302",
      },
    },
    Friday: {
      "10:00 AM": {
        course: "Data Structures",
        teacher: "Dr. Sarah Johnson",
        room: "CS-101",
      },
      "1:00 PM": {
        course: "Calculus I",
        teacher: "Prof. Michael Chen",
        room: "MATH-201",
      },
      "4:00 PM": {
        course: "Quantum Physics",
        teacher: "Dr. James Wilson",
        room: "PHYS-301",
      },
    },
  });

  const [constraints, setConstraints] = useState([
    {
      id: 1,
      type: "Teacher",
      name: "Dr. Sarah Johnson",
      constraint: "No more than 2 lectures per day",
    },
    {
      id: 2,
      type: "Room",
      name: "CS-101",
      constraint: "Available only mornings",
    },
    {
      id: 3,
      type: "Course",
      name: "Quantum Physics",
      constraint: "Must be scheduled after 12 PM",
    },
  ]);

  useEffect(() => {
    if (onMount) onMount();
    if (autoStartGeneration) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = () => {
    const nameError = validateTimetableName(timetableName);
    if (nameError) {
      setValidationErrors([nameError.message]);
      return;
    }
    setValidationErrors([]);
    setIsGenerating(true);
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setGenerationComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDownload = (format: string) => {
    try {
      setValidationErrors([]);
      const nameError = validateTimetableName(timetableName);
      if (nameError) {
        setValidationErrors([nameError.message]);
        return;
      }

      const timetableData = timetable as Record<
        string,
        Record<string, TimetableSession | undefined>
      >;

      switch (format) {
        case "pdf":
          downloadAsPDF(timetableData, timetableName);
          break;
        case "excel":
          downloadAsExcel(timetableData, timetableName);
          break;
        case "csv":
          downloadAsCSV(timetableData, timetableName);
          break;
        default:
          throw new Error("Invalid download format");
      }
      setShowDownloadModal(false);
    } catch (error) {
      console.error("Download failed:", error);
      setValidationErrors([
        error instanceof Error ? error.message : "Download failed",
      ]);
    }
  };

  const handleAddConstraint = () => {
    setShowAddConstraintForm(true);
  };

  const handleSaveConstraint = (e: React.FormEvent) => {
    e.preventDefault();
    const id = constraints.length
      ? Math.max(...constraints.map((c) => c.id)) + 1
      : 1;
    setConstraints([
      ...constraints,
      {
        id,
        type: newConstraint.type,
        name: newConstraint.name,
        constraint: newConstraint.constraint,
      },
    ]);
    setNewConstraint({
      type: "Teacher",
      name: "",
      constraint: "",
    });
    setShowAddConstraintForm(false);
  };

  const PlusIcon = ({ size = 24, className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Timetable Generation
          </h1>
          <p className="mt-1 text-gray-600">
            Generate and view optimized timetables
          </p>
        </div>
        {generationComplete && (
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors"
              onClick={() => setShowDownloadModal(true)}
            >
              <DownloadIcon size={18} className="mr-2" /> Export Timetable
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
              onClick={() => setGenerationComplete(false)}
            >
              <RefreshCwIcon size={18} className="mr-2" /> New Generation
            </button>
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Generation Settings
            </button>
            {/* <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "constraints"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("constraints")}
            >
              Constraints
            </button> */}
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "results"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("results")}
            >
              Results
            </button>
          </nav>
        </div>
        <div className="pt-6">
          {activeTab === "settings" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Timetable Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Fall Semester 2023"
                    value={timetableName}
                    onChange={(e) => setTimetableName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="algorithm"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Algorithm
                  </label>
                  <select
                    id="algorithm"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="genetic">Genetic Algorithm</option>
                    <option value="simulated">Simulated Annealing</option>
                    <option value="constraint">Constraint Programming</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="iterations"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Max Iterations
                  </label>
                  <input
                    type="number"
                    id="iterations"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    defaultValue="1000"
                  />
                </div>
                <div>
                  <label
                    htmlFor="timeout"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    id="timeout"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    defaultValue="5"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                {!isGenerating && !generationComplete ? (
                  <button
                    onClick={handleGenerate}
                    className="px-6 py-3 bg-red-600 text-white rounded-md flex items-center hover:bg-red-700 transition-colors"
                  >
                    <PlayIcon size={18} className="mr-2" /> Generate Timetable
                  </button>
                ) : isGenerating ? (
                  <div className="w-full max-w-md">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-red-600">
                        Generating timetable...
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        {generationProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-red-600 h-2.5 rounded-full"
                        style={{
                          width: `${generationProgress}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <CheckIcon size={24} className="mr-2" />
                    <span className="font-medium">
                      Timetable Generated Successfully!
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "constraints" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Active Constraints
                </h3>
                <button
                  onClick={handleAddConstraint}
                  className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center hover:bg-red-700 transition-colors"
                >
                  <PlusIcon size={18} className="mr-2" /> Add Constraint
                </button>
              </div>
              {showAddConstraintForm && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-md font-medium text-gray-800 mb-4">
                    Add New Constraint
                  </h4>
                  <form onSubmit={handleSaveConstraint}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={newConstraint.type}
                          onChange={(e) =>
                            setNewConstraint({
                              ...newConstraint,
                              type: e.target.value,
                            })
                          }
                        >
                          <option value="Teacher">Teacher</option>
                          <option value="Room">Room</option>
                          <option value="Course">Course</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={newConstraint.name}
                          onChange={(e) =>
                            setNewConstraint({
                              ...newConstraint,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Constraint
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={newConstraint.constraint}
                          onChange={(e) =>
                            setNewConstraint({
                              ...newConstraint,
                              constraint: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowAddConstraintForm(false)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Save Constraint
                      </button>
                    </div>
                  </form>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Constraint
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {constraints.map((constraint) => (
                      <tr key={constraint.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {constraint.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {constraint.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {constraint.constraint}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-red-600 hover:text-red-900">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {constraints.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No constraints added yet. Click "Add Constraint" to create
                    one.
                  </p>
                </div>
              )}
            </div>
          )}
          {activeTab === "results" && (
            <div>
              {generationComplete ? (
                <div>
                  <div className="mb-4 flex items-center">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <CheckIcon size={14} className="mr-1" /> No conflicts
                      detected
                    </div>
                    <div className="ml-4 text-sm text-gray-500">
                      Optimization score: 92/100
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          {daysOfWeek.map((day) => (
                            <th
                              key={day}
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {timeSlots.map((time) => (
                          <tr key={time}>
                            <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                              {time}
                            </td>
                            {daysOfWeek.map((day) => {
                              const session = timetable[day][time];
                              return (
                                <td
                                  key={`${day}-${time}`}
                                  className="px-4 py-3"
                                >
                                  {session ? (
                                    <div className="bg-blue-50 border border-blue-100 rounded p-2 text-xs">
                                      <div className="font-medium text-blue-800">
                                        {session.course}
                                      </div>
                                      <div className="text-gray-600">
                                        {session.teacher}
                                      </div>
                                      <div className="text-gray-500">
                                        Room: {session.room}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="h-16"></div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangleIcon
                    size={48}
                    className="text-yellow-500 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No timetable generated yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Go to the Generation Settings tab to create a new timetable
                  </p>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Go to Settings
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownload={handleDownload}
      />
      {validationErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <AlertTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                The following errors occurred:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableGenerationPortal;
