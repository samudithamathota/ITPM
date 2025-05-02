import { useEffect, useState } from "react";
import Layout from "./components/LayOut";
import TeacherPortal from "./components/TeacherPortal";
import LecturePortal from "./components/CoursePortal";
import TimeAllocationPortal from "./components/TimeAllocationPortal";
import FileInputPortal from "./components/FileInputPortal";
import TimetableGenerationPortal from "./components/TimeTableGenerationPortal";
import Dashboard from "./components/Dashboard";
import RoomPortal from "./components/RoomPortal";
import StudentPortal from "./components/StudentPortal";
import { Auth } from "./components/authentication/Authentication";
import { useAuth } from "./context/AuthContext";

export function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const { isAuthenticated, logout } = useAuth();

  // Reset protected page if user is authenticated but activePage is login
  useEffect(() => {
    if (isAuthenticated && activePage === "login") {
      setActivePage("dashboard");
    }
  }, [isAuthenticated, activePage]);

  // Cleanup local storage flags on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem("showAddTeacherForm");
      localStorage.removeItem("showAddLectureForm");
      localStorage.removeItem("startTimetableGeneration");
      localStorage.removeItem("showAddRoomForm");
      localStorage.removeItem("showAddStudentForm");
    };
  }, []);

  if (!isAuthenticated) {
    return <Auth onLogin={() => setActivePage("dashboard")} />;
  }

  const renderContent = () => {
    const pageMap: Record<string, string> = {
      dashboard: "dashboard",
      teachers: "teachers",
      lectures: "lectures",
      rooms: "rooms",
      students: "students",
      timeAllocation: "time-allocation",
      fileInput: "file-input",
      timetableGeneration: "timetable",
    };

    const actualPage =
      Object.entries(pageMap).find(
        ([layoutId]) => layoutId === activePage
      )?.[1] || "dashboard";

    switch (actualPage) {
      case "dashboard":
        return <Dashboard setCurrentPage={setActivePage} />;
      case "teachers":
        return (
          <TeacherPortal
            autoOpenForm={localStorage.getItem("showAddTeacherForm") === "true"}
            onMount={() => localStorage.removeItem("showAddTeacherForm")}
          />
        );
      case "lectures":
        return (
          <LecturePortal
            autoOpenForm={localStorage.getItem("showAddLectureForm") === "true"}
            onMount={() => localStorage.removeItem("showAddLectureForm")}
          />
        );
      case "rooms":
        return (
          <RoomPortal
            autoOpenForm={localStorage.getItem("showAddRoomForm") === "true"}
            onMount={() => localStorage.removeItem("showAddRoomForm")}
          />
        );
      case "students":
        return (
          <StudentPortal
            autoOpenForm={localStorage.getItem("showAddStudentForm") === "true"}
            onMount={() => localStorage.removeItem("showAddStudentForm")}
          />
        );
      case "time-allocation":
        return <TimeAllocationPortal />;
      case "file-input":
        return <FileInputPortal />;
      case "timetable":
        return (
          <TimetableGenerationPortal
            autoStartGeneration={
              localStorage.getItem("startTimetableGeneration") === "true"
            }
            onMount={() => localStorage.removeItem("startTimetableGeneration")}
          />
        );
      default:
        return <Dashboard setCurrentPage={setActivePage} />;
    }
  };

  return (
    <Layout
      activePage={activePage}
      setActivePage={setActivePage}
      logout={logout} // Pass logout function to Layout
    >
      {renderContent()}
    </Layout>
  );
}
