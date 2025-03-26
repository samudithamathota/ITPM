import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  SearchIcon,
  TrashIcon,
  EditIcon,
  StarIcon,
  BuildingIcon,
} from "lucide-react";
interface TeacherPortalProps {
  autoOpenForm?: boolean;
  onMount?: () => void;
}
const TeacherPortal = ({
  autoOpenForm = false,
  onMount,
}: TeacherPortalProps) => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      department: "Computer Science",
      courses: ["Data Structures", "Algorithms"],
      availability: "Mon-Wed-Fri",
      seniority: 5,
      building: "CS Building",
      isAdmin: true,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(autoOpenForm);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    department: "",
    courses: "",
    availability: "",
    seniority: 1,
    building: "",
    isAdmin: false,
  });
  useEffect(() => {
    if (onMount) onMount();
  }, []);
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const id = teachers.length ? Math.max(...teachers.map((t) => t.id)) + 1 : 1;
    setTeachers([
      ...teachers,
      {
        id,
        name: newTeacher.name,
        department: newTeacher.department,
        courses: newTeacher.courses.split(",").map((course) => course.trim()),
        availability: newTeacher.availability,
        seniority: newTeacher.seniority,
        building: newTeacher.building,
        isAdmin: newTeacher.isAdmin,
      },
    ]);
    setNewTeacher({
      name: "",
      department: "",
      courses: "",
      availability: "",
      seniority: 1,
      building: "",
      isAdmin: false,
    });
    setShowAddForm(false);
  };
  const handleDeleteTeacher = (id: number) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
  };
  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Teacher Management
          </h1>
          <p className="mt-1 text-gray-600">
            Add and manage teachers for timetable generation
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
        >
          <PlusIcon size={18} className="mr-2" /> Add Teacher
        </button>
      </div>
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Teacher
          </h2>
          <form onSubmit={handleAddTeacher}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTeacher.name}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      name: e.target.value,
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTeacher.department}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      department: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="courses"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Courses (comma separated)
                </label>
                <input
                  type="text"
                  id="courses"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTeacher.courses}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      courses: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="availability"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Availability
                </label>
                <input
                  type="text"
                  id="availability"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mon-Wed-Fri"
                  value={newTeacher.availability}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      availability: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="seniority"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Seniority Level
                </label>
                <select
                  id="seniority"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTeacher.seniority}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      seniority: parseInt(e.target.value),
                    })
                  }
                  required
                >
                  <option value={1}>Junior Faculty</option>
                  <option value={2}>Assistant Professor</option>
                  <option value={3}>Associate Professor</option>
                  <option value={4}>Professor</option>
                  <option value={5}>Senior Professor</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="building"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Primary Building
                </label>
                <select
                  id="building"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTeacher.building}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
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
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newTeacher.isAdmin}
                    onChange={(e) =>
                      setNewTeacher({
                        ...newTeacher,
                        isAdmin: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Senior Staff Member (Can modify timetable)
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Teacher
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Teacher List</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search teachers..."
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
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seniority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.department}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {teacher.courses.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.availability}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {Array.from({
                        length: teacher.seniority,
                      }).map((_, i) => (
                        <StarIcon
                          key={i}
                          size={16}
                          className="text-yellow-400"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <BuildingIcon size={16} className="mr-2" />
                      {teacher.building}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {teacher.isAdmin ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Senior Staff
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Faculty
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <EditIcon size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      <TrashIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {teachers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No teachers added yet. Click "Add Teacher" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default TeacherPortal;
