import { useState, createContext, useContext, ReactNode } from "react";

type Teacher = { id: string; name: string };
type Lecture = { id: string; name: string; teacherId?: string };
type TimeAllocation = {
  id: string;
  day: string;
  timeSlot: string;
  lectureId: string;
};

interface AppContextType {
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;

  lectures: Lecture[];
  addLecture: (lecture: Omit<Lecture, "id">) => void;
  updateLecture: (lecture: Lecture) => void;
  deleteLecture: (id: string) => void;

  timeAllocations: TimeAllocation[];
  addTimeAllocation: (allocation: Omit<TimeAllocation, "id">) => void;
  updateTimeAllocation: (allocation: TimeAllocation) => void;
  deleteTimeAllocation: (id: string) => void;

  generatedTimetable: any;
  generateTimetable: () => any;
  setGeneratedTimetable: (timetable: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Teachers state
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const addTeacher = (teacher: Omit<Teacher, "id">) => {
    setTeachers([...teachers, { ...teacher, id: Date.now().toString() }]);
  };
  const updateTeacher = (updatedTeacher: Teacher) => {
    setTeachers(
      teachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
    );
  };
  const deleteTeacher = (id: string) => {
    setTeachers(teachers.filter((t) => t.id !== id));
  };

  // Lectures state
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const addLecture = (lecture: Omit<Lecture, "id">) => {
    setLectures([...lectures, { ...lecture, id: Date.now().toString() }]);
  };
  const updateLecture = (updatedLecture: Lecture) => {
    setLectures(
      lectures.map((l) => (l.id === updatedLecture.id ? updatedLecture : l))
    );
  };
  const deleteLecture = (id: string) => {
    setLectures(lectures.filter((l) => l.id !== id));
  };

  // Time allocations state
  const [timeAllocations, setTimeAllocations] = useState<TimeAllocation[]>([]);
  const addTimeAllocation = (allocation: Omit<TimeAllocation, "id">) => {
    setTimeAllocations([
      ...timeAllocations,
      { ...allocation, id: Date.now().toString() },
    ]);
  };
  const updateTimeAllocation = (updatedAllocation: TimeAllocation) => {
    setTimeAllocations(
      timeAllocations.map((a) =>
        a.id === updatedAllocation.id ? updatedAllocation : a
      )
    );
  };
  const deleteTimeAllocation = (id: string) => {
    setTimeAllocations(timeAllocations.filter((a) => a.id !== id));
  };

  // Generated timetable
  const [generatedTimetable, setGeneratedTimetable] = useState<any>(null);
  const generateTimetable = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = [
      "9:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
    ];

    const timetable = days.map((day) => {
      const slots = timeSlots.map((timeSlot) => {
        const availableLectures = lectures.filter(
          (l) =>
            !timeAllocations.some(
              (a) =>
                a.day === day && a.timeSlot === timeSlot && a.lectureId === l.id
            )
        );
        const randomLecture =
          availableLectures.length > 0
            ? availableLectures[
                Math.floor(Math.random() * availableLectures.length)
              ]
            : null;
        const teacher = randomLecture
          ? teachers.find((t) => t.id === randomLecture.teacherId)
          : null;
        return {
          timeSlot,
          lecture: randomLecture ? randomLecture.name : null,
          teacher: teacher ? teacher.name : null,
          room: randomLecture
            ? `Room ${Math.floor(Math.random() * 10) + 101}`
            : null,
        };
      });
      return { day, slots };
    });

    setGeneratedTimetable(timetable);
    return timetable;
  };

  return (
    <AppContext.Provider
      value={{
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        lectures,
        addLecture,
        updateLecture,
        deleteLecture,
        timeAllocations,
        addTimeAllocation,
        updateTimeAllocation,
        deleteTimeAllocation,
        generatedTimetable,
        generateTimetable,
        setGeneratedTimetable,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
