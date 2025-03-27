// src/services/api.ts

interface Teacher {
  id: number;
  name: string;
  department: string;
  courses: string[];
  availability: string;
  seniority: number;
  building: string;
  isAdmin: boolean;
}

interface Lecture {
  id: number;
  name: string;
  code: string;
  department: string;
  duration: number;
  weeklyFrequency: number;
  location: string;
  building: string;
  requiresLab: boolean;
  transitionTime: number;
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const API = {
  // Teacher endpoints
  async getTeachers(): Promise<Teacher[]> {
    const response = await fetch(`${API_BASE}/teachers`);
    if (!response.ok) throw new Error("Failed to fetch teachers");
    return await response.json();
  },

  async addTeacher(teacherData: Omit<Teacher, "id">): Promise<Teacher> {
    const response = await fetch(`${API_BASE}/teachers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(teacherData),
    });
    if (!response.ok) throw new Error("Failed to add teacher");
    return await response.json();
  },

  async deleteTeacher(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/teachers/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete teacher");
  },

  // Lecture endpoints
  async getLectures(): Promise<Lecture[]> {
    const response = await fetch(`${API_BASE}/lectures`);
    if (!response.ok) throw new Error("Failed to fetch lectures");
    return await response.json();
  },

  async addLecture(lectureData: Omit<Lecture, "id">): Promise<Lecture> {
    const response = await fetch(`${API_BASE}/lectures`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(lectureData),
    });
    if (!response.ok) throw new Error("Failed to add lecture");
    return await response.json();
  },

  async updateLecture(lecture: Lecture): Promise<Lecture> {
    const response = await fetch(`${API_BASE}/lectures/${lecture.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(lecture),
    });
    if (!response.ok) throw new Error("Failed to update lecture");
    return await response.json();
  },

  async deleteLecture(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/lectures/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete lecture");
  },
};
