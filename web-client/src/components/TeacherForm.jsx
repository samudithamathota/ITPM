// src/components/TeacherForm.jsx
import React, { useState, useEffect } from "react";
import {
  createTeacherController,
  updateTeacherController,
} from "../controllers/TeacherController";

const TeacherForm = ({ teacher, onSuccess }) => {
  const [formData, setFormData] = useState({
    teach_name: "",
    user_table_id: "",
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        teach_name: teacher.teach_name,
        user_table_id: teacher.user_table_id,
      });
    }
  }, [teacher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (teacher) {
        response = await updateTeacherController(teacher._id, formData);
      } else {
        response = await createTeacherController(formData);
      }
      if (response.success) {
        onSuccess();
        setFormData({ teach_name: "", user_table_id: "" }); // Reset form
      }
    } catch (error) {
      console.error("Error submitting teacher form", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white shadow-md rounded-lg"
    >
      <div>
        <label
          htmlFor="teach_name"
          className="block text-sm font-medium text-gray-700"
        >
          Teacher Name
        </label>
        <input
          type="text"
          id="teach_name"
          name="teach_name"
          value={formData.teach_name}
          onChange={(e) =>
            setFormData({ ...formData, teach_name: e.target.value })
          }
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="user_table_id"
          className="block text-sm font-medium text-gray-700"
        >
          User Table ID
        </label>
        <input
          type="number"
          id="user_table_id"
          name="user_table_id"
          value={formData.user_table_id}
          onChange={(e) =>
            setFormData({ ...formData, user_table_id: e.target.value })
          }
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {teacher ? "Update Teacher" : "Create Teacher"}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;
