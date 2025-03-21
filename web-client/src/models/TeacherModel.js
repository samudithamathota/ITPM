// src/models/teacherModel.js
import axios from "axios";

const API_URL = "/api/teachers"; // Adjust with your actual API endpoint

export const createTeacher = async (teacherData) => {
  try {
    const response = await axios.post(API_URL, teacherData);
    return response.data;
  } catch (error) {
    console.error("Error creating teacher", error);
    throw error;
  }
};

export const updateTeacher = async (teacherId, teacherData) => {
  try {
    const response = await axios.put(`${API_URL}/${teacherId}`, teacherData);
    return response.data;
  } catch (error) {
    console.error("Error updating teacher", error);
    throw error;
  }
};

export const deleteTeacher = async (teacherId) => {
  try {
    const response = await axios.delete(`${API_URL}/${teacherId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting teacher", error);
    throw error;
  }
};

export const getTeachers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers", error);
    throw error;
  }
};
