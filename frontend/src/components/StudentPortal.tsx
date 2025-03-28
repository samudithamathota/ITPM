import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  SearchIcon,
  TrashIcon,
  EditIcon,
  Loader2Icon,
} from "lucide-react";
import { API } from "../services/api";

interface Student {
  id: number;
  batch: string;
  courses: string[];
  count: number;
  year: string;
  semester: string;
  department: string;
}

interface StudentPortalProps {
  autoOpenForm?: boolean;
  onMount?: () => void;
}

interface StudentFormProps {
  student: {
    batch: string;
    courses: string[];
    count: number;
    year: string;
    semester: string;
    department: string;
  };
  setStudent: React.Dispatch<
    React.SetStateAction<{
      batch: string;
      courses: string[];
      count: number;
      year: string;
      semester: string;
      department: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  isLoading: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({
  student,
  setStudent,
  onSubmit,
  onCancel,
  isEditing,
  isLoading,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditing ? "Edit Student" : "Add New Student"}
      </h2>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={student.batch}
              onChange={(e) =>
                setStudent({ ...student, batch: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={student.department}
              onChange={(e) =>
                setStudent({ ...student, department: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={student.year}
              onChange={(e) => setStudent({ ...student, year: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={student.semester}
              onChange={(e) =>
                setStudent({ ...student, semester: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Count
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={student.count}
              onChange={(e) =>
                setStudent({ ...student, count: parseInt(e.target.value) || 0 })
              }
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Courses (comma separated)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={student.courses.join(", ")}
              onChange={(e) =>
                setStudent({
                  ...student,
                  courses: e.target.value
                    .split(",")
                    .map((course) => course.trim()),
                })
              }
              required
            />
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
            {isEditing ? "Update Student" : "Save Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

const StudentPortal: React.FC<StudentPortalProps> = ({
  autoOpenForm = false,
  onMount,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [showAddForm, setShowAddForm] = useState(autoOpenForm);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    batch: "",
    courses: [] as string[],
    count: 0,
    year: "",
    semester: "",
    department: "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data = await API.getStudents();
        setStudents(data);
      } catch (err) {
        setError("Failed to load students. Please try again later.");
        console.error("Error fetching students:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
    if (onMount) onMount();
  }, [onMount]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);

      if (editingStudent) {
        const updatedStudent = await API.updateStudent({
          ...newStudent,
          id: editingStudent.id,
        });
        setStudents(
          students.map((s) => (s.id === editingStudent.id ? updatedStudent : s))
        );
      } else {
        const newStudentRecord = await API.addStudent(newStudent);
        setStudents([...students, newStudentRecord]);
      }
      resetForm();
    } catch (err) {
      setError(
        editingStudent
          ? "Failed to update student. Please try again."
          : "Failed to add student. Please try again."
      );
      console.error("Error saving student:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setNewStudent({
      batch: student.batch,
      courses: student.courses,
      count: student.count,
      year: student.year,
      semester: student.semester,
      department: student.department,
    });
    setShowAddForm(true);
  };

  const handleDeleteStudent = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      setIsLoading(true);
      await API.deleteStudent(id);
      setStudents(students.filter((student) => student.id !== id));
    } catch (err) {
      setError("Failed to delete student. Please try again.");
      console.error("Error deleting student:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewStudent({
      batch: "",
      courses: [] as string[],
      count: 0,
      year: "",
      semester: "",
      department: "",
    });
    setEditingStudent(null);
    setShowAddForm(false);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.courses.some((course) =>
        course.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (isLoading && students.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2Icon className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Student Management
          </h1>
          <p className="mt-1 text-gray-600">Manage student records</p>
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
          {showAddForm ? "Cancel" : "Add Student"}
        </button>
      </div>

      {showAddForm && (
        <StudentForm
          student={newStudent}
          setStudent={setNewStudent}
          onSubmit={handleAddStudent}
          onCancel={resetForm}
          isEditing={!!editingStudent}
          isLoading={isLoading}
        />
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Student List</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm
                ? "No students match your search."
                : "No students added yet. Click 'Add Student' to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.batch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.count}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {student.courses.join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleEditStudent(student)}
                        disabled={isLoading}
                      >
                        <EditIcon size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteStudent(student.id)}
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
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
