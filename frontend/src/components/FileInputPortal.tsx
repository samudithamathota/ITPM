import React, { useState } from "react";
import {
  UploadIcon,
  FileIcon,
  CheckCircleIcon,
  XCircleIcon,
  DownloadIcon,
} from "lucide-react";
const FileInputPortal = () => {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: "teachers_data.csv",
      type: "Teachers",
      status: "success",
      date: "2023-09-10",
    },
    {
      id: 2,
      name: "courses_fall_2023.xlsx",
      type: "Lectures",
      status: "success",
      date: "2023-09-10",
    },
    {
      id: 3,
      name: "room_availability.csv",
      type: "Rooms",
      status: "error",
      date: "2023-09-09",
    },
  ]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState("Teachers");
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newFile = {
        id: files.length ? Math.max(...files.map((f) => f.id)) + 1 : 1,
        name: file.name,
        type: selectedFileType,
        status: Math.random() > 0.2 ? "success" : "error",
        date: new Date().toISOString().split("T")[0],
      };
      setFiles([...files, newFile]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFile = {
        id: files.length ? Math.max(...files.map((f) => f.id)) + 1 : 1,
        name: file.name,
        type: selectedFileType,
        status: Math.random() > 0.2 ? "success" : "error",
        date: new Date().toISOString().split("T")[0],
      };
      setFiles([...files, newFile]);
    }
  };

  const handleDeleteFile = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">File Input</h1>
        <p className="mt-1 text-gray-600">
          Upload data files for timetable generation
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Upload Files
        </h2>
        <div className="mb-4">
          <label
            htmlFor="fileType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            File Type
          </label>
          <select
            id="fileType"
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
          >
            <option value="Teachers">Teachers Data</option>
            <option value="Lectures">Lectures/Courses Data</option>
            <option value="Rooms">Rooms Data</option>
            <option value="Constraints">Constraints Data</option>
          </select>
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-yellow-500 bg-yellow-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <UploadIcon size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your files here, or
              <label className="text-yellow-600 hover:text-yellow-700 cursor-pointer ml-1">
                browse
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </p>
            <p className="text-gray-500 text-sm">
              Supported formats: CSV, Excel, XML
            </p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>Need help with file formats? Download our templates:</p>
          <div className="mt-2 flex space-x-4">
            <button className="text-yellow-600 hover:text-yellow-700 flex items-center">
              <DownloadIcon size={16} className="mr-1" /> Teachers Template
            </button>
            <button className="text-yellow-600 hover:text-yellow-700 flex items-center">
              <DownloadIcon size={16} className="mr-1" /> Lectures Template
            </button>
            <button className="text-yellow-600 hover:text-yellow-700 flex items-center">
              <DownloadIcon size={16} className="mr-1" /> Rooms Template
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Uploaded Files
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => (
                <tr key={file.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileIcon size={20} className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {file.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {file.status === "success" ? (
                        <>
                          <CheckCircleIcon
                            size={16}
                            className="text-green-500 mr-1"
                          />
                          <span className="text-sm text-green-500">
                            Success
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon
                            size={16}
                            className="text-red-500 mr-1"
                          />
                          <span className="text-sm text-red-500">Error</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {file.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {files.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No files uploaded yet. Use the upload section above to add files.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default FileInputPortal;
