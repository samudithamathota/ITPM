import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/LayOut";
import TeacherPortal from "./components/TeacherPortal";
import LecturePortal from "./components/LecturePortal";
import TimeAllocationPortal from "./components/TimeAllocationPortal";
import FileInputPortal from "./components/FileInputPortal";
import TimetableGenerationPortal from "./components/TimeTableGenerationPortal";
export function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const renderPage = () => {
    switch (activePage) {
      case "teachers":
        return <TeacherPortal />;
      case "lectures":
        return <LecturePortal />;
      case "timeAllocation":
        return <TimeAllocationPortal />;
      case "fileInput":
        return <FileInputPortal />;
      case "timetableGeneration":
        return <TimetableGenerationPortal />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">
              Welcome to AcademiSync
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mb-8">
              Your comprehensive timetable management solution for educational
              institutions. Navigate through the sidebar to access different
              features.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Teachers",
                  icon: "👨‍🏫",
                  page: "teachers",
                  description: "Add and manage teaching staff",
                },
                {
                  title: "Lectures",
                  icon: "📚",
                  page: "lectures",
                  description: "Create and organize lectures",
                },
                {
                  title: "Time Allocation",
                  icon: "⏰",
                  page: "timeAllocation",
                  description: "Set available time slots",
                },
                {
                  title: "File Input",
                  icon: "📁",
                  page: "fileInput",
                  description: "Import data from files",
                },
                {
                  title: "Timetable Generation",
                  icon: "📅",
                  page: "timetableGeneration",
                  description: "Generate and export timetables",
                },
              ].map((item) => (
                <div
                  key={item.page}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                  onClick={() => setActivePage(item.page)}
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h2 className="text-xl font-semibold text-blue-600 mb-2">
                    {item.title}
                  </h2>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };
  return (
    <AppProvider>
      <Layout activePage={activePage} setActivePage={setActivePage}>
        {renderPage()}
      </Layout>
    </AppProvider>
  );
}
