import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface AuthProps {
  onLogin: () => void;
}

export const Auth = ({ onLogin }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center w-full p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            Timetable Management
          </h2>
          <p className="text-blue-100 mt-1">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        <div className="px-8 py-6">
          <div className="flex mb-6 border-b">
            <button
              className={`flex-1 py-2 font-medium text-center transition-all ${
                isLogin
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Log In
            </button>
            <button
              className={`flex-1 py-2 font-medium text-center transition-all ${
                !isLogin
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {isLogin ? (
            <LoginForm onLoginSuccess={onLogin} />
          ) : (
            <SignupForm onSignupSuccess={onLogin} />
          )}
        </div>
      </div>
    </div>
  );
};
