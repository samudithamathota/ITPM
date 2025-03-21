// src/controllers/teacherController.js
import {
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeachers,
} from "../models/TeacherModel";

export const createTeacherController = async (teacherData) => {
  const data = await createTeacher(teacherData);
  return data;
};

export const updateTeacherController = async (teacherId, teacherData) => {
  const data = await updateTeacher(teacherId, teacherData);
  return data;
};

export const deleteTeacherController = async (teacherId) => {
  const data = await deleteTeacher(teacherId);
  return data;
};

export const getTeachersController = async () => {
  const data = await getTeachers();
  return data;
};
