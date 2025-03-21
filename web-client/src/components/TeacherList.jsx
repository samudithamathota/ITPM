// src/components/TeacherList.jsx
import React from "react";
import { deleteTeacherController } from "../controllers/TeacherController";

const TeacherList = ({ teachers, onDelete, onEdit }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacherController(id);
        onDelete(id); // Refresh teacher list after deletion
      } catch (error) {
        console.error("Error deleting teacher", error);
      }
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold text-gray-800">Teacher List</h2>
      <ul className="space-y-3">
        {teachers.map((teacher) => (
          <li
            key={teacher.teacher_id}
            className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            <span>{teacher.teach_name}</span>
            <div>
              <button
                onClick={() => onEdit(teacher)}
                className="mr-2 text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(teacher._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherList;
