import React, { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  Camera,
  ChevronRight,
  Edit,
  MessageSquare,
  Settings,
  Upload,
  User,
  Video,
  X,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../redux/slices/authSlice";
import { applyAsPhotographer } from "../../Redux/slice/authThunk"; // adjust import path as needed
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ApiLink from "../../api";

const PhotographerDashboard = () => {
  // Get the logged-in user details from Redux
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for photographer details (initialized from Redux)
  const [photographerDetails, setPhotographerDetails] = useState(user || {});

  // Local state for portfolio images and booking requests
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([
    {
      id: 1,
      clientName: "Emma Davis",
      date: "March 15, 2025",
      time: "2:00 PM - 4:00 PM",
      status: "Pending",
    },
    {
      id: 2,
      clientName: "Michael Brown",
      date: "March 18, 2025",
      time: "10:00 AM - 1:00 PM",
      status: "Pending",
    },
    {
      id: 3,
      clientName: "Sarah Wilson",
      date: "March 20, 2025",
      time: "3:30 PM - 5:30 PM",
      status: "Accepted",
    },
    {
      id: 4,
      clientName: "David Thompson",
      date: "March 22, 2025",
      time: "11:00 AM - 2:00 PM",
      status: "Rejected",
    },
  ]);

  // Active tab for navigation
  const [activeTab, setActiveTab] = useState("dashboard");
  // Equipment input
  const [newEquipment, setNewEquipment] = useState("");
  // Application form visibility and fields
  const [applicationFormVisible, setApplicationFormVisible] = useState(false);
  const [appForm, setAppForm] = useState({
    camera: "",
    expertise: "",
    address: "",
    price: "",
  });
  const [samplePics, setSamplePics] = useState([]);
  const [appError, setAppError] = useState("");
  // For portfolio image upload in the Portfolio tab
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    // Try to use user from Redux; if it's missing, fall back to localStorage.
    const currentUser = user || JSON.parse(localStorage.getItem("user"));
    if (currentUser && currentUser.id) {
      setPhotographerDetails(currentUser);
      fetchPortfolioImages(currentUser.id);
    }
  }, [user]); // This effect will also run when Redux user changes.

  // Fetch portfolio images using GET /images/:id
  const fetchPortfolioImages = async (userId) => {
    try {
      const res = await axios.get(
        `${ApiLink.photographerDetails.url}/${userId}`
      );
      // Expecting response.data.Images to be an object with key equal to userId
      const imagesForUser = res.data.Images ? res.data.Images[userId] : [];
      // Map to extract URL from each image. Adjust this if your API returns a different structure.
      const urls = imagesForUser.map((img) => img.url);
      setPortfolioImages(urls);
    } catch (error) {
      console.error("Error fetching portfolio images:", error);
    }
  };

  // Equipment handlers update local state and Redux state
  const handleAddEquipment = () => {
    if (newEquipment.trim()) {
      const updatedEquipment = [
        ...(photographerDetails.equipment || []),
        newEquipment,
      ];
      const updatedDetails = {
        ...photographerDetails,
        equipment: updatedEquipment,
      };
      setPhotographerDetails(updatedDetails);
      dispatch(login({ ...user, ...updatedDetails }));
      setNewEquipment("");
    }
  };

  const handleRemoveEquipment = (index) => {
    const updatedEquipment = [...(photographerDetails.equipment || [])];
    updatedEquipment.splice(index, 1);
    const updatedDetails = {
      ...photographerDetails,
      equipment: updatedEquipment,
    };
    setPhotographerDetails(updatedDetails);
    dispatch(login({ ...user, ...updatedDetails }));
  };

  // Booking requests update status
  const handleUpdateStatus = (id, newStatus) => {
    const updatedRequests = bookingRequests.map((request) =>
      request.id === id ? { ...request, status: newStatus } : request
    );
    setBookingRequests(updatedRequests);
  };

  // Handlers for the application form
  const handleAppFormChange = (e) => {
    const { name, value } = e.target;
    setAppForm({ ...appForm, [name]: value });
  };

  const handleFileChange = (e) => {
    setSamplePics([...e.target.files]);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setAppError("");

    if (
      !appForm.camera ||
      !appForm.expertise ||
      !appForm.address ||
      !appForm.price
    ) {
      setAppError("Please fill in all required fields.");
      return;
    }
    if (samplePics.length === 0) {
      setAppError("Please upload at least one sample picture.");
      return;
    }

    try {
      const payload = {
        formData: {
          name: photographerDetails.name,
          email: photographerDetails.email,
          camera: appForm.camera,
          expertise: appForm.expertise,
          address: appForm.address,
          price: appForm.price,
        },
        samplePics, // array of File objects
      };

      const resultAction = await dispatch(applyAsPhotographer(payload));
      if (applyAsPhotographer.fulfilled.match(resultAction)) {
        // Update local photographer details with new application fields
        const updatedDetails = {
          ...photographerDetails,
          camera: appForm.camera,
          expertise: appForm.expertise,
          address: appForm.address,
          price: appForm.price,
        };
        setPhotographerDetails(updatedDetails);
        dispatch(login({ ...user, ...updatedDetails }));
        setApplicationFormVisible(false);
        setAppForm({ camera: "", expertise: "", address: "", price: "" });
        setSamplePics([]);
        // Re-fetch portfolio images in case some were uploaded as part of the application
        fetchPortfolioImages(user.id);
      } else {
        setAppError(resultAction.payload || "Application submission failed.");
      }
    } catch (error) {
      setAppError("An error occurred. Please try again.");
    }
  };

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Portfolio image upload handler using /upload API
  const handlePortfolioImageUpload = async () => {
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append("image", uploadFile);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const res = await axios.post(ApiLink.uploadImage.url, formData, config);
      if (res.data.url) {
        setPortfolioImages([...portfolioImages, res.data.url]);
        setUploadFile(null);
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-full">
        <div className="p-6 flex items-center border-b border-gray-100">
          <Camera className="text-indigo-600 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">SnapShoot</h1>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "dashboard"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <User className="mr-3 h-5 w-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "portfolio"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Camera className="mr-3 h-5 w-5" />
                <span>Portfolio</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("appointments")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "appointments"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Calendar className="mr-3 h-5 w-5" />
                <span>Appointments</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("messages")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "messages"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                <span>Messages</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "settings"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "dashboard" && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, {photographerDetails.name}!
              </h1>
              <p className="text-gray-600">
                Let's check what's happening today.
              </p>
            </div>

            {/* Show application button if key fields are missing */}
            {(!photographerDetails.camera ||
              !photographerDetails.expertise ||
              !photographerDetails.address) && (
              <div className="mb-6">
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none"
                  onClick={() => setApplicationFormVisible(true)}
                >
                  Complete Photographer Application
                </button>
              </div>
            )}

            {/* Application Form */}
            {applicationFormVisible && (
              <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Photographer Application
                </h2>
                {appError && (
                  <p className="mb-4 text-red-500 text-sm">{appError}</p>
                )}
                <form onSubmit={handleSubmitApplication}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Camera
                    </label>
                    <input
                      type="text"
                      name="camera"
                      value={appForm.camera}
                      onChange={handleAppFormChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your primary camera"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Expertise
                    </label>
                    <input
                      type="text"
                      name="expertise"
                      value={appForm.expertise}
                      onChange={handleAppFormChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. Portrait, Landscape, Events"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={appForm.address}
                      onChange={handleAppFormChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your studio or operating area"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={appForm.price}
                      onChange={handleAppFormChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your hourly rate in NPR"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Sample Pictures
                    </label>
                    <input
                      type="file"
                      name="samplePics"
                      multiple
                      onChange={handleFileChange}
                      className="mt-1 block w-full"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                    >
                      Submit Application
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
                      onClick={() => setApplicationFormVisible(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Overview Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Profile Overview
                  </h2>
                  <button className="flex items-center text-sm text-indigo-600">
                    <Edit className="h-4 w-4 mr-1" /> Edit Profile
                  </button>
                </div>
                <div className="flex items-center mb-4">
                  <img
                    src={photographerDetails.profileImage}
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {photographerDetails.name}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          photographerDetails.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {photographerDetails.status}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {photographerDetails.bio}
                </p>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hourly Rate</span>
                    <span className="font-medium">
                      NPR {photographerDetails.price}/hr
                    </span>
                  </div>
                  {photographerDetails.camera && (
                    <div className="mt-2 text-sm text-gray-700">
                      <div>
                        <strong>Camera:</strong> {photographerDetails.camera}
                      </div>
                      <div>
                        <strong>Expertise:</strong>{" "}
                        {photographerDetails.expertise}
                      </div>
                      <div>
                        <strong>Address:</strong> {photographerDetails.address}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Equipment List */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Equipment
                  </h2>
                </div>
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      placeholder="Add new equipment..."
                      value={newEquipment}
                      onChange={(e) => setNewEquipment(e.target.value)}
                    />
                    <button
                      className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
                      onClick={handleAddEquipment}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <ul className="space-y-2">
                  {(photographerDetails.equipment || []).map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md"
                    >
                      <span className="text-sm text-gray-700">{item}</span>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleRemoveEquipment(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upcoming Bookings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Upcoming Bookings
                  </h2>
                  <button
                    className="text-sm text-indigo-600 flex items-center"
                    onClick={() => setActiveTab("appointments")}
                  >
                    View all <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {bookingRequests
                    .filter((request) => request.status === "Accepted")
                    .slice(0, 3)
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="border-b border-gray-100 pb-3 last:border-b-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {booking.clientName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {booking.date}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.time}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1 text-gray-500 hover:text-indigo-600">
                              <MessageSquare className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-500 hover:text-indigo-600">
                              <Video className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {bookingRequests.filter(
                    (request) => request.status === "Accepted"
                  ).length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      No upcoming bookings
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Portfolio Preview */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Portfolio Preview
                </h2>
                <div className="flex items-center gap-2">
                  {/* File input for new portfolio image */}
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="hidden"
                    id="uploadPortfolio"
                  />
                  <label
                    htmlFor="uploadPortfolio"
                    className="flex items-center cursor-pointer text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    <Upload className="h-4 w-4 mr-2" /> Choose File
                  </label>
                  <button
                    onClick={handlePortfolioImageUpload}
                    className="flex items-center text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {portfolioImages.map((image, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden h-32 bg-gray-100 relative group"
                  >
                    <img
                      src={image}
                      alt={`Portfolio ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Booking Requests */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Booking Requests
                </h2>
                <button
                  className="text-sm text-indigo-600 flex items-center"
                  onClick={() => setActiveTab("appointments")}
                >
                  View all <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookingRequests
                      .filter((request) => request.status === "Pending")
                      .map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {request.clientName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {request.date}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.time}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "Accepted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                Accept
                              </button>
                              <button className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                                Decline
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {bookingRequests.filter(
                      (request) => request.status === "Pending"
                    ).length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-sm text-gray-500 italic"
                        >
                          No pending requests
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Portfolio Management
              </h1>
              <p className="text-gray-600">
                Upload and manage your photography work
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Your Portfolio
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="hidden"
                    id="uploadPortfolioImage"
                  />
                  <label
                    htmlFor="uploadPortfolioImage"
                    className="flex items-center cursor-pointer text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    <Upload className="h-4 w-4 mr-2" /> Choose File
                  </label>
                  <button
                    onClick={handlePortfolioImageUpload}
                    className="flex items-center text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {portfolioImages.map((image, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden h-32 bg-gray-100 relative group"
                  >
                    <img
                      src={image}
                      alt={`Portfolio ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
              <p className="text-gray-600">
                Manage your upcoming bookings and requests
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Booking Requests
                </h2>
                <div className="space-y-4">
                  {bookingRequests
                    .filter((request) => request.status === "Pending")
                    .map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {request.clientName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {request.date}
                            </p>
                            <p className="text-xs text-gray-500">
                              {request.time}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                              Accept
                            </button>
                            <button className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {bookingRequests.filter(
                    (request) => request.status === "Pending"
                  ).length === 0 && (
                    <p className="text-sm text-gray-500 italic text-center py-4">
                      No pending requests
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Confirmed Bookings
                </h2>
                <div className="space-y-4">
                  {bookingRequests
                    .filter((request) => request.status === "Accepted")
                    .map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {request.clientName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {request.date}
                            </p>
                            <p className="text-xs text-gray-500">
                              {request.time}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1 text-gray-500 hover:text-indigo-600">
                              <MessageSquare className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-500 hover:text-indigo-600">
                              <Video className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {bookingRequests.filter(
                    (request) => request.status === "Accepted"
                  ).length === 0 && (
                    <p className="text-sm text-gray-500 italic text-center py-4">
                      No confirmed bookings
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Booking Calendar
              </h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">
                  Calendar view would be implemented here
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
              <p className="text-gray-600">Communicate with your clients</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="h-96 flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Your Messages
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Stay connected with your clients through secure messaging
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-600">Manage your account preferences</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Profile Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={photographerDetails.name}
                    onChange={(e) =>
                      setPhotographerDetails({
                        ...photographerDetails,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="4"
                    value={photographerDetails.bio}
                    onChange={(e) =>
                      setPhotographerDetails({
                        ...photographerDetails,
                        bio: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={photographerDetails.hourlyRate}
                    onChange={(e) =>
                      setPhotographerDetails({
                        ...photographerDetails,
                        hourlyRate: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="pt-4 flex justify-between">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Save Changes
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Bell (Fixed Position) */}
        <div className="fixed top-4 right-4">
          <button className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-indigo-600 focus:outline-none">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotographerDashboard;
