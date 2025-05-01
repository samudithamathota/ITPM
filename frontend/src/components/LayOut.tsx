import React, { ReactNode } from "react";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ClockIcon,
  FileIcon,
  CalendarIcon,
  Building,
  Smile,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  children: ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
  logout: () => void;
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <HomeIcon size={20} />,
  },
  {
    id: "teachers",
    label: "Teachers",
    icon: <UsersIcon size={20} />,
  },
  {
    id: "lectures",
    label: "Courses",
    icon: <BookOpenIcon size={20} />,
  },
  {
    id: "rooms",
    label: "Room Allocation",
    icon: <Building size={20} />,
  },
  {
    id: "students",
    label: "Students",
    icon: <Smile size={20} />,
  },
  {
    id: "timeAllocation",
    label: "Time Allocation",
    icon: <ClockIcon size={20} />,
  },
  {
    id: "fileInput",
    label: "File Input",
    icon: <FileIcon size={20} />,
  },
  {
    id: "timetableGeneration",
    label: "Timetable Generation",
    icon: <CalendarIcon size={20} />,
  },
  {
    id: "login",
    label: <span className="text-red-500">Log Out</span>,
    icon: <LogOut size={20} className="text-red-500" />,
  },
];

const Layout: React.FC<LayoutProps> = ({
  children,
  activePage,
  setActivePage,
  logout,
}) => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 bg-blue-600">
          <h1 className="text-2xl font-bold text-white">AcademiSync</h1>
        </div>
        <nav className="mt-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
                    activePage === item.id
                      ? "bg-blue-100 text-blue-600 border-r-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActivePage(item.id);
                    if (item.id === "login") logout();
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* navbar */}
        <header className="bg-white shadow-sm ">
          <div className="px-6 py-4 flex items-center justify-between ">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => item.id === activePage)?.label ||
                "Dashboard"}
            </h2>

            <div className="flex flex-row  mt-2 space-x-4">
              <img
                src={"/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold">{user?.fullName}</p>
                <p className="text-xs">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
