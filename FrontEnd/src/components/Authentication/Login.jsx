import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // 1) Import useNavigate
import { setCredentials } from "../../redux/slices/authSlice"; // Adjust path as needed
import { useLoginMutation, useRegisterMutation } from "../../redux/api/authApi";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for both login and register form fields
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "login") {
        const result = await login({
          email: loginData.email,
          password: loginData.password,
        }).unwrap();

        const { user, token } = result;
        if (!token)
          throw new Error("Authentication token missing from response");

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setCredentials({ user, token, role: user.role }));
        alert(result.message || "Success!");

        setLoginData({ email: "", password: "" });

        // Role-based navigation after login
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "photographer") {
          navigate("/photographer/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        // Registration branch
        const result = await register({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        }).unwrap();

        alert(result.message || "Registration successful! Please log in.");
        // Clear register form if desired
        setRegisterData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        // Pre-fill login form with the registration email (optional)
        setLoginData({ email: result.user.email, password: "" });
        // Switch UI to login tab
        setActiveTab("login");
      }
    } catch (error) {
      alert(error.message || "Error occurred");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
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
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                 {/* Replace this anchor with your own link or onClick handler */}
                 <a
                    href="/forgot-password"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Forgot password?
                  </a>
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
                  <span className="w-full border-t" />
                </div>
              
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
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="reg-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="reg-password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={registerData.password}
                  onChange={handleRegisterChange}
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
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
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
    </div>
  );
}
