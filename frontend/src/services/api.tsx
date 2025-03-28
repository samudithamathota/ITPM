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

interface Student {
  id: number;
  batch: string;
  courses: string[];
  count: number;
  year: string;
  semester: string;
  department: string;
}

interface Room {
  id: number;
  roomNumber: string; // e.g., "A101", "B205"
  building: string;
  capacity: number;
  roomType: "lecture" | "lab" | "seminar" | "other";
  equipment: string[]; // e.g., ["projector", "whiteboard", "computers"]
  availability: string; // Could be a schedule or general availability
  isAccessible: boolean;
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

  async updateTeacher(teacher: Teacher): Promise<Teacher> {
    const response = await fetch(`${API_BASE}/teachers/${teacher.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(teacher),
    });
    if (!response.ok) throw new Error("Failed to update teacher");
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

  // Student endpoints
  async getStudents(): Promise<Student[]> {
    const response = await fetch(`${API_BASE}/students`);
    if (!response.ok) throw new Error("Failed to fetch students");
    return await response.json();
  },

  async getStudent(id: number): Promise<Student> {
    const response = await fetch(`${API_BASE}/students/${id}`);
    if (!response.ok) throw new Error("Failed to fetch student");
    return await response.json();
  },

  async addStudent(studentData: Omit<Student, "id">): Promise<Student> {
    const response = await fetch(`${API_BASE}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) throw new Error("Failed to add student");
    return await response.json();
  },

  async updateStudent(student: Student): Promise<Student> {
    const response = await fetch(`${API_BASE}/students/${student.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(student),
    });
    if (!response.ok) throw new Error("Failed to update student");
    return await response.json();
  },

  async deleteStudent(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/students/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete student");
  },

  async getRooms(): Promise<Room[]> {
    const response = await fetch(`${API_BASE}/rooms`);
    if (!response.ok) throw new Error("Failed to fetch rooms");
    return await response.json();
  },

  async getRoom(id: number): Promise<Room> {
    const response = await fetch(`${API_BASE}/rooms/${id}`);
    if (!response.ok) throw new Error("Failed to fetch room");
    return await response.json();
  },

  async addRoom(roomData: Omit<Room, "id">): Promise<Room> {
    const response = await fetch(`${API_BASE}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(roomData),
    });
    if (!response.ok) throw new Error("Failed to add room");
    return await response.json();
  },

  async updateRoom(room: Room): Promise<Room> {
    const response = await fetch(`${API_BASE}/rooms/${room.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(room),
    });
    if (!response.ok) throw new Error("Failed to update room");
    return await response.json();
  },

  async deleteRoom(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/rooms/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete room");
  },
};
