import { FileIcon, XIcon } from "lucide-react";
interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (format: string) => void;
}
const DownloadModal = ({ isOpen, onClose, onDownload }: DownloadModalProps) => {
  if (!isOpen) return null;
  const downloadFormats = [
    {
      id: "pdf",
      name: "PDF Document",
      description: "Best for printing and sharing",
      icon: <FileIcon className="text-red-500" size={24} />,
    },
    {
      id: "excel",
      name: "Excel Spreadsheet",
      description: "Best for editing and analysis",
      icon: <FileIcon className="text-green-500" size={24} />,
    },
    {
      id: "csv",
      name: "CSV File",
      description: "Best for data import/export",
      icon: <FileIcon className="text-yellow-500" size={24} />,
    },
  ];
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Download Timetable
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {downloadFormats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => onDownload(format.id)}
                      className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0">{format.icon}</div>
                      <div className="ml-4 text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {format.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DownloadModal;
