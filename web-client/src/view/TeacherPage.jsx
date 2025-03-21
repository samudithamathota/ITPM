// src/views/TeacherPage.jsx
import React, { useState, useEffect } from "react";
import TeacherForm from "../components/TeacherForm";
import TeacherList from "../components/TeacherList";
import { getTeachersController } from "../controllers/TeacherController";

const TeacherPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const teacherData = await getTeachersController();
      setTeachers(teacherData);
    } catch (error) {
      console.error("Error fetching teachers", error);
    }
  };

  const handleDelete = (teacherId) => {
    setTeachers((prevTeachers) =>
      prevTeachers.filter((teacher) => teacher._id !== teacherId)
    );
  };

  const handleEdit = (teacher) => {
    setCurrentTeacher(teacher);
  };

  const handleFormSuccess = () => {
    setCurrentTeacher(null);
    fetchTeachers();
  };

  return (
    <div className="container mx-auto p-4">
      <TeacherForm teacher={currentTeacher} onSuccess={handleFormSuccess} />
      <TeacherList
        teachers={teachers}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default TeacherPage;
