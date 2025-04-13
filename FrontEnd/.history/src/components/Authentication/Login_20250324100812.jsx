import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful login/registration
    console.log(
      "Form submitted. Here you can handle navigation or state updates."
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header removed; add your own header markup if needed */}
      <main className="flex flex-1 items-center justify-center py-12 bg-gray-100">
        <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
          {/* Title and description */}
          <div className="mb-6 space-y-1 text-center">
            <h1 className="text-2xl font-bold text-purple-700">
              {activeTab === "login" ? "Account Login" : "Register Account"}
            </h1>
            <p className="text-gray-500">
              {activeTab === "login"
                ? "Login to access your account and bookings"
                : "Create an account to start booking photographers"}
            </p>
          </div>

          {/* Toggle buttons for login/register */}
          <div className="mb-6 grid w-full grid-cols-2">
            <button
              onClick={() => setActiveTab("login")}
              className={`py-2 text-sm font-medium transition-colors rounded-l-md ${
                activeTab === "login"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`py-2 text-sm font-medium transition-colors rounded-r-md ${
                activeTab === "register"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Register
            </button>
          </div>

          {/* Conditionally render Login or Register form */}
          {activeTab === "login" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  {/* Replace this anchor with your own link or onClick handler */}
                  <a
                    href="/forgot-password"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                Login
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* OAuth buttons (replace with real OAuth actions) */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 16.991 5.65731 21.128 10.4383 21.879V14.89H7.89831V12H10.4383V9.797C10.4383 7.291 11.9323 5.907 14.2153 5.907C15.3103 5.907 16.4543 6.102 16.4543 6.102V8.562H15.1923C13.9503 8.562 13.5623 9.333 13.5623 10.124V12H16.3363L15.8933 14.89H13.5623V21.879C18.3433 21.129 22.0003 16.99 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2Z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="reg-name" className="text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="reg-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="reg-password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="Create a password"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </main>
      {/* Footer removed; add your own footer markup if needed */}
    </div>
  );
}
