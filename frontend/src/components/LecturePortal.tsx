import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  SearchIcon,
  TrashIcon,
  EditIcon,
  ClockIcon,
  MapPinIcon,
} from "lucide-react";
interface LecturePortalProps {
  autoOpenForm?: boolean;
  onMount?: () => void;
}
const LecturePortal = ({
  autoOpenForm = false,
  onMount,
}: LecturePortalProps) => {
  const [lectures, setLectures] = useState([
    {
      id: 1,
      name: "Data Structures",
      code: "CS301",
      department: "Computer Science",
      duration: 180,
      weeklyFrequency: 3,
      location: "CS-101",
      building: "CS Building",
      requiresLab: true,
      transitionTime: 15,
    },
    {
      id: 2,
      name: "Calculus I",
      code: "MATH201",
      department: "Mathematics",
      duration: 90,
      weeklyFrequency: 2,
    },
    {
      id: 3,
      name: "Quantum Physics",
      code: "PHYS401",
      department: "Physics",
      duration: 120,
      weeklyFrequency: 2,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(autoOpenForm);
  useEffect(() => {
    if (onMount) onMount();
  }, []);
  const [newLecture, setNewLecture] = useState({
    name: "",
    code: "",
    department: "",
    duration: 180,
    weeklyFrequency: 1,
    location: "",
    building: "",
    requiresLab: false,
    transitionTime: 15,
  });
  useEffect(() => {
    if (window.localStorage) {
      const shouldShowForm = window.localStorage.getItem("showAddLectureForm");
      if (shouldShowForm === "true") {
        setShowAddForm(true);
        window.localStorage.removeItem("showAddLectureForm");
      }
    }
  }, []);
  const validateLectureTime = (duration: number) => {
    if (duration < 60) {
      return "Duration must be at least 1 hour";
    }
    if (duration > 180) {
      return "Duration cannot exceed 3 hours";
    }
    return null;
  };
  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    const timeError = validateLectureTime(newLecture.duration);
    if (timeError) {
      alert(timeError);
      return;
    }
    const id = lectures.length ? Math.max(...lectures.map((l) => l.id)) + 1 : 1;
    setLectures([
      ...lectures,
      {
        id,
        name: newLecture.name,
        code: newLecture.code,
        department: newLecture.department,
        duration: newLecture.duration,
        weeklyFrequency: newLecture.weeklyFrequency,
        location: newLecture.location,
        building: newLecture.building,
        requiresLab: newLecture.requiresLab,
        transitionTime: newLecture.transitionTime,
      },
    ]);
    setNewLecture({
      name: "",
      code: "",
      department: "",
      duration: 180,
      weeklyFrequency: 1,
      location: "",
      building: "",
      requiresLab: false,
      transitionTime: 15,
    });
    setShowAddForm(false);
  };
  const handleDeleteLecture = (id: number) => {
    setLectures(lectures.filter((lecture) => lecture.id !== id));
  };
  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Lecture Management
          </h1>
          <p className="mt-1 text-gray-600">
            Add and manage lectures for timetable generation
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors"
        >
          <PlusIcon size={18} className="mr-2" /> Add Lecture
        </button>
      </div>
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Lecture
          </h2>
          <form onSubmit={handleAddLecture}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lecture Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newLecture.name}
                  onChange={(e) =>
                    setNewLecture({
                      ...newLecture,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Code
                </label>
                <input
                  type="text"
                  id="code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newLecture.code}
                  onChange={(e) =>
                    setNewLecture({
                      ...newLecture,
                      code: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newLecture.department}
                  onChange={(e) =>
                    setNewLecture({
                      ...newLecture,
                      department: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration (minutes)
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="duration"
                    min="60"
                    max="180"
                    step="30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newLecture.duration}
                    onChange={(e) =>
                      setNewLecture({
                        ...newLecture,
                        duration: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                  <ClockIcon size={20} className="ml-2 text-gray-400" />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Minimum 1 hour, maximum 3 hours
                </p>
              </div>
              <div>
                <label
                  htmlFor="building"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Building
                </label>
                <select
                  id="building"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newLecture.building}
                  onChange={(e) =>
                    setNewLecture({
                      ...newLecture,
                      building: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Building</option>
                  <option value="CS Building">CS Building</option>
                  <option value="Science Complex">Science Complex</option>
                  <option value="Engineering Block">Engineering Block</option>
                  <option value="Math Department">Math Department</option>
                  <option value="Physics Lab">Physics Lab</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Room/Location
                </label>
                <input
                  type="text"
                  id="location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newLecture.location}
                  onChange={(e) =>
                    setNewLecture({
                      ...newLecture,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g., Room 101"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="transitionTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Required Transition Time (minutes)
                </label>
                <input
                  type="number"
                  id="transitionTime"
                  min="5"
                  max="30"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={newLecture.transitionTime}
                  onChange={(e) =>
                    setNewLecture({
                      ...newLecture,
                      transitionTime: parseInt(e.target.value),
                    })
                  }
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Time needed for room setup and student transition
                </p>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newLecture.requiresLab}
                    onChange={(e) =>
                      setNewLecture({
                        ...newLecture,
                        requiresLab: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    Requires Lab Access
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 mr-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Lecture
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Lecture List</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Search lectures..."
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weekly Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lectures.map((lecture) => (
                <tr key={lecture.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lecture.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecture.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecture.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecture.duration} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecture.weeklyFrequency} times
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPinIcon size={16} className="mr-2" />
                      {lecture.building} - {lecture.location}
                      {lecture.requiresLab && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Lab
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lecture.transitionTime} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <EditIcon size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteLecture(lecture.id)}
                    >
                      <TrashIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lectures.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No lectures added yet. Click "Add Lecture" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default LecturePortal;
