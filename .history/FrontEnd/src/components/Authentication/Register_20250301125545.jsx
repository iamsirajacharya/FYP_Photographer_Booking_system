import React, { useState } from "react";
import axios from "axios";
import { AlertCircle, Camera, User, Mail, Phone, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ApiLink from "../../api";

const Register = () => {
  const navigate = useNavigate();
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "client",
    profile_image: null,
    agreesToTerms: false,
  });

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);

  // Validate form function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!formData.agreesToTerms) {
      newErrors.agreesToTerms =
        "You must agree to the Terms and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profile_image: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // For image upload, use FormData
      if (formData.profile_image) {
        const formDataToSend = new FormData();
        formDataToSend.append("username", formData.username);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("role", formData.role);
        formDataToSend.append("profile_image", formData.profile_image);

        const response = await axios.post(
          ApiLink.register.url,
          formDataToSend,
          {
            withCredentials: true,
          }
        );

        console.log("Registration response:", response.data);
      } else {
        // Without image, send regular JSON
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: formData.role,
        };

        console.log("Sending data:", userData);

        const response = await axios.post(ApiLink.register.url, userData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        console.log("Registration response:", response.data);
      }

      setSuccessMessage("Registration successful! Redirecting to login...");

      // Reset form after successful registration
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: "client",
        profile_image: null,
        agreesToTerms: false,
      });
      setPhotoPreview(null);

      // Redirect to login after a delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      console.log("Error response data:", err.response?.data);

      if (err.response?.data?.message) {
        setErrors({
          general: err.response.data.message,
        });
      } else if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({
          general: "Registration failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          {successMessage && (
            <p className="text-green-600 text-center">{successMessage}</p>
          )}
          {errors.general && (
            <p className="text-red-600 text-center">{errors.general}</p>
          )}
          <p className="text-gray-600 mt-2">Join our photography community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer"
              >
                <input
                  type="file"
                  id="photo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <span className="text-white text-xl">+</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Username</span>
                </div>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.username ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email address</span>
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                </div>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </div>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Confirm Password</span>
                </div>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.role ? "border-red-300" : "border-gray-300"
                } px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              >
                <option value="">Select role</option>
                <option value="client">Client</option>
                <option value="photographer">Photographer</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.role}
                </p>
              )}
            </div>

            {/* <div className="flex items-center">
              <input
                type="checkbox"
                name="agreesToTerms"
                checked={formData.agreesToTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-500 hover:text-blue-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-500 hover:text-blue-700">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreesToTerms && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.agreesToTerms}
              </p>
            )}
          </div> */}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <a href="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
