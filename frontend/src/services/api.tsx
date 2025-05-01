// src/services/api.ts
export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
interface Teacher {
  id: string;
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
  building: string;
  requiresLab: boolean;
  transitionTime: number;
}

interface Student {
  _id: string;
  batch: string;
  courses: string[];
  count: number;
  year: string;
  semester: string;
  department: string;
}

interface Room {
  _id: string;
  name: string;
  building: string;
  department: string;
  capacity: number;
  availability: string;
  type: number;
}

interface TimeAllocationPayload {
  // _id: string;
  allocationKey: {
    year: string;
    semester: string;
    department: string;
  };
  weekdays?: {
    [day: string]: {
      availableSlots: string[];
      unavailableSlots: string[];
    };
  };
  weekends?: {
    [day: string]: {
      availableSlots: string[];
      unavailableSlots: string[];
    };
  };
  settings: {
    slotDuration: number;
    weekdayStartTime: string;
    weekdayEndTime: string;
    weekendStartTime: string;
    weekendEndTime: string;
  };
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8070/api";

export const AuthAPI = {
  async signUp(
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return (await response.json()) as AuthResponse;
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return await response.json();
  },
};

export const API = {
  // Teacher endpoints
  async getTeachers(): Promise<Teacher[]> {
    const response = await fetch(`${API_BASE}/teachers`);
    if (!response.ok) throw new Error("Failed to fetch teachers");
    return await response.json();
  },

  async addTeacher(teacherData: Omit<Teacher, "id">): Promise<Teacher> {
    const response = await fetch(`${API_BASE}/teachers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("token")}`, // Remove this line if authentication is not required
      },
      body: JSON.stringify(teacherData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add teacher");
    }

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

  async deleteTeacher(id: string): Promise<void> {
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
    const response = await fetch(`${API_BASE}/lectures/`);
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

  async addStudent(studentData: Omit<Student, "_id">): Promise<Student> {
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
    const response = await fetch(`${API_BASE}/students/${student._id}`, {
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

  async deleteStudent(id: string): Promise<void> {
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

  async addRoom(roomData: Omit<Room, "_id">): Promise<Room> {
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
    const response = await fetch(`${API_BASE}/rooms/${room._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(room),
    });
    if (!response.ok) throw new Error("Failed to update room");
    return await response.json();
  },

  async deleteRoom(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/rooms/${id}`, {
      method: "DELETE",
      headers: {
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete room");
  },

  // Time Allocation

  async getTimeAllocation(): Promise<TimeAllocationPayload> {
    const response = await fetch(`${API_BASE}/time-allocations/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch time allocation");
    }
    return await response.json();
  },

  async saveTimeAllocation(
    payload: TimeAllocationPayload
  ): Promise<TimeAllocationPayload> {
    const response = await fetch(`${API_BASE}/time-allocations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to save time allocation");
    return await response.json();
  },

  async updateTimeAllocation(
    year: string,
    semester: string,
    department: string,
    payload: TimeAllocationPayload
  ): Promise<TimeAllocationPayload> {
    const response = await fetch(
      `${API_BASE}/time-allocations/${year}/${semester}/${department}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) throw new Error("Failed to update time allocation");
    return await response.json();
  },

  // async deleteTimeAllocationById(id: string): Promise<void> {
  //   const response = await fetch(`${API_BASE}/time-allocations/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   });

  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     throw new Error(errorData.message || "Failed to delete time allocation");
  //   }
  // },
};
