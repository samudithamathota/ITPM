import {
  UsersIcon,
  BookOpenIcon,
  ClockIcon,
  FileTextIcon,
  CalendarIcon,
  Building,
} from "lucide-react";

interface DashboardProps {
  setCurrentPage: (page: string) => void;
  setShowAddTeacherForm?: () => void;
  setShowAddLectureForm?: () => void;
}
const Dashboard = ({ setCurrentPage }: DashboardProps) => {
  const handleStatCardClick = (page: string) => {
    setCurrentPage(page);
  };
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-teacher":
        localStorage.setItem("showAddTeacherForm", "true");
        setCurrentPage("teachers");
        break;
      case "add-lecture":
        localStorage.setItem("showAddLectureForm", "true");
        setCurrentPage("lectures");
        break;
      case "generate-timetable":
        localStorage.setItem("startTimetableGeneration", "true");
        setCurrentPage("timetableGeneration");
        break;
    }
  };
  const stats = [
    {
      name: "Teachers",
      count: 24,
      icon: <UsersIcon size={24} className="text-blue-500" />,
      page: "teachers",
    },
    {
      name: "Courses",
      count: 48,
      icon: <BookOpenIcon size={24} className="text-green-500" />,
      page: "lectures",
    },
    {
      name: "Rooms",
      count: 3,
      icon: <Building size={24} className="text-orange-500" />,
      page: "rooms",
    },
    {
      name: "Time Allocation",
      count: 35,
      icon: <ClockIcon size={24} className="text-purple-500" />,
      page: "timeAllocation",
    },
    {
      name: "Files",
      count: 3,
      icon: <FileTextIcon size={24} className="text-yellow-500" />,
      page: "fileInput",
    },
    {
      name: "Timetables",
      count: 2,
      icon: <CalendarIcon size={24} className="text-red-500" />,
      page: "timetableGeneration",
    },
  ];
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to AcademiSync Timetable Generator
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => handleStatCardClick(stat.page)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-50">{stat.icon}</div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  {stat.name}
                </h2>
                <p className="text-3xl font-bold text-gray-800">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleQuickAction("add-teacher")}
            className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UsersIcon size={18} className="mr-2" /> Add New Teacher
          </button>
          <button
            onClick={() => handleQuickAction("add-lecture")}
            className="flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <BookOpenIcon size={18} className="mr-2" /> Add New Lecture
          </button>
          <button
            onClick={() => handleQuickAction("generate-timetable")}
            className="flex items-center justify-center p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <CalendarIcon size={18} className="mr-2" /> Generate Timetable
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Timetables
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Fall Semester 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Aug 15, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Summer School 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  May 20, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Archived
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
