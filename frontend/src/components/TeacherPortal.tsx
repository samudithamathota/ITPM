import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  SearchIcon,
  TrashIcon,
  EditIcon,
  StarIcon,
  BuildingIcon,
  Loader2Icon,
} from "lucide-react";
import { API } from "../services/api";

interface Teacher {
  id: string; // Ensure id is always a string
  name: string;
  department: string;
  courses: string[];
  availability: string;
  seniority: number;
  building: string;
  isAdmin: boolean;
}

interface TeacherPortalProps {
  autoOpenForm?: boolean;
  onMount?: () => void;
}

interface TeacherFormProps {
  teacher: {
    name: string;
    department: string;
    courses: string;
    availability: string;
    seniority: number;
    building: string;
    isAdmin: boolean;
  };
  setTeacher: React.Dispatch<
    React.SetStateAction<{
      name: string;
      department: string;
      courses: string;
      availability: string;
      seniority: number;
      building: string;
      isAdmin: boolean;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  isLoading: boolean;
}

const TeacherForm: React.FC<TeacherFormProps> = ({
  teacher,
  setTeacher,
  onSubmit,
  onCancel,
  isEditing,
  isLoading,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditing ? "Edit Teacher" : "Add New Teacher"}
      </h2>
      <form onSubmit={onSubmit}>
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
              value={teacher.name}
              onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
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
              value={teacher.department}
              onChange={(e) =>
                setTeacher({ ...teacher, department: e.target.value })
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
              value={teacher.courses}
              onChange={(e) =>
                setTeacher({ ...teacher, courses: e.target.value })
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
              value={teacher.availability}
              onChange={(e) =>
                setTeacher({ ...teacher, availability: e.target.value })
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
              value={teacher.seniority}
              onChange={(e) =>
                setTeacher({ ...teacher, seniority: parseInt(e.target.value) })
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
              value={teacher.building}
              onChange={(e) =>
                setTeacher({ ...teacher, building: e.target.value })
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
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 mr-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2Icon className="animate-spin mr-2" size={18} />
            )}
            {isEditing ? "Update Teacher" : "Save Teacher"}
          </button>
        </div>
      </form>
    </div>
  );
};

interface TeacherTableProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const TeacherTable: React.FC<TeacherTableProps> = ({
  teachers,
  onEdit,
  onDelete,
  isLoading,
}) => {
  return (
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
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th> */}
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
                {(teacher.courses || []).join(", ")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {teacher.availability}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {Array.from({ length: teacher.seniority }).map((_, i) => (
                    <StarIcon key={i} size={16} className="text-yellow-400" />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <BuildingIcon size={16} className="mr-2" />
                  {teacher.building}
                </div>
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                {teacher.isAdmin ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Senior Staff
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Faculty
                  </span>
                )}
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  onClick={() => onEdit(teacher)}
                  disabled={isLoading}
                >
                  <EditIcon size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => onDelete(teacher.id)}
                  disabled={isLoading}
                >
                  <TrashIcon size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TeacherPortal: React.FC<TeacherPortalProps> = ({
  autoOpenForm = false,
  onMount,
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showAddForm, setShowAddForm] = useState(autoOpenForm);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    const fetchTeachers = async () => {
      try {
        setIsLoading(true);
        const data = await API.getTeachers();
        console.log("Fetched teachers from backend:", data); // Add this line
        setTeachers(data);
      } catch (err) {
        setError("Failed to load teachers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
    if (onMount) onMount();
  }, [onMount]);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);

      const teacherData: Teacher = {
        id: editingTeacher?.id || Date.now().toString(), // Generate a unique string ID
        name: newTeacher.name,
        department: newTeacher.department,
        courses: newTeacher.courses.split(",").map((c) => c.trim()),
        availability: newTeacher.availability,
        seniority: newTeacher.seniority,
        building: newTeacher.building,
        isAdmin: newTeacher.isAdmin,
      };
      console.log("Submitting teacher data:", teacherData);
      console.log("Calculated teacher ID:", teacherData.id);

      if (editingTeacher) {
        const updatedTeacher = await API.updateTeacher(teacherData);
        console.log("Updated teacher response:", updatedTeacher); // Add this line
        setTeachers(
          teachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
        );
      } else {
        const savedTeacher = await API.addTeacher(teacherData);
        console.log("New teacher response:", savedTeacher); // Add this line
        console.log("Saved Teacher:");
        setTeachers([...teachers, savedTeacher]);
      }

      resetForm();
    } catch (err) {
      setError(
        editingTeacher
          ? "Failed to update teacher. Please try again."
          : "Failed to add teacher. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setNewTeacher({
      name: teacher.name,
      department: teacher.department,
      courses: teacher.courses.join(", "),
      availability: teacher.availability,
      seniority: teacher.seniority,
      building: teacher.building,
      isAdmin: teacher.isAdmin,
    });
    setShowAddForm(true);
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;

    try {
      setIsLoading(true);
      console.log("Deleting teacher with ID:", id); // Add this line
      await API.deleteTeacher(id);
      setTeachers(teachers.filter((teacher) => teacher.id !== id));
    } catch (err) {
      setError("Failed to delete teacher. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewTeacher({
      name: "",
      department: "",
      courses: "",
      availability: "",
      seniority: 1,
      building: "",
      isAdmin: false,
    });
    setEditingTeacher(null);
    setShowAddForm(false);
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && teachers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2Icon className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Header and Add Button */}
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
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          <PlusIcon size={18} className="mr-2" />
          {showAddForm ? "Cancel" : "Add Teacher"}
        </button>
      </div>

      {/* Teacher Form */}
      {showAddForm && (
        <TeacherForm
          teacher={newTeacher}
          setTeacher={setNewTeacher}
          onSubmit={handleAddTeacher}
          onCancel={resetForm}
          isEditing={!!editingTeacher}
          isLoading={isLoading}
        />
      )}

      {/* Teacher List */}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? "No teachers match your search."
                : "No teachers added yet. Click 'Add Teacher' to get started."}
            </p>
          </div>
        ) : (
          <TeacherTable
            teachers={filteredTeachers}
            onEdit={handleEditTeacher}
            onDelete={handleDeleteTeacher}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherPortal;
