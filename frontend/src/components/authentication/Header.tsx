import { BookOpenIcon } from "lucide-react";
export const AuthHeader = () => {
  return (
    <div className="bg-blue-600 p-6 flex flex-col items-center">
      <div className="bg-white p-3 rounded-full mb-3">
        <BookOpenIcon size={32} className="text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-white">AcademiSync</h1>
      <p className="text-blue-100 text-sm">Your Academic Success Partner</p>
    </div>
  );
};
