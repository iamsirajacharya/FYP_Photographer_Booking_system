import { useState, useEffect } from "react";
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
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  useGetPhotographerPortfolioQuery,
  useUploadPortfolioImageMutation,
  useApplyAsPhotographerMutation,
  useUpdatePhotographerProfileMutation,
} from "../redux/api/photographerApi";
import { useGetAllBookingsQuery } from "../redux/api/bookingApi";

const PhotographerDashboard = () => {
  // Get logged-in user details from Redux
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for photographer details and UI states
  const [photographerDetails, setPhotographerDetails] = useState(
    user?.photographerProfile || {}
  );
  const [newEquipment, setNewEquipment] = useState("");
  const [applicationFormVisible, setApplicationFormVisible] = useState(false);
  const [appForm, setAppForm] = useState({
    camera: "",
    expertise: "",
    address: "",
    price: "",
  });
  const [samplePics, setSamplePics] = useState([]);
  const [appError, setAppError] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // RTK Query hooks
  const { data: portfolioData, isLoading: portfolioLoading } =
    useGetPhotographerPortfolioQuery(photographerDetails.id, {
      skip: !photographerDetails.id,
    });

  const { data: bookingsData, isLoading: bookingsLoading } =
    useGetAllBookingsQuery({});

  const [uploadPortfolioImage, { isLoading: isUploading }] =
    useUploadPortfolioImageMutation();
  const [applyAsPhotographer] = useApplyAsPhotographerMutation();
  const [updatePhotographerProfile, { isLoading: isUpdating }] =
    useUpdatePhotographerProfileMutation();

  // Derived state
  const portfolioImages = portfolioData?.portfolioImages || [];
  const bookingRequests =
    bookingsData?.bookings?.filter(
      (booking) => booking.photographers?.id === photographerDetails.id
    ) || [];

  useEffect(() => {
    // Use the Redux user or fallback from localStorage
    const currentUser = user || JSON.parse(localStorage.getItem("user"));
    if (currentUser && currentUser.photographerProfile) {
      setPhotographerDetails(currentUser.photographerProfile);
    }
  }, [user]);

  // Update equipment locally and then persist the change via API
  const handleAddEquipment = async () => {
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
      try {
        await updatePhotographerProfile(updatedDetails).unwrap();
      } catch (error) {
        console.error("Failed to update equipment", error);
      }
      setNewEquipment("");
    }
  };

  const handleRemoveEquipment = async (index) => {
    const updatedEquipment = [...(photographerDetails.equipment || [])];
    updatedEquipment.splice(index, 1);
    const updatedDetails = {
      ...photographerDetails,
      equipment: updatedEquipment,
    };
    setPhotographerDetails(updatedDetails);
    try {
      await updatePhotographerProfile(updatedDetails).unwrap();
    } catch (error) {
      console.error("Failed to update equipment", error);
    }
  };

  // Portfolio image upload using mutation hook
  const handlePortfolioImageUpload = async () => {
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append("portfolioImages", uploadFile);
    try {
      const res = await uploadPortfolioImage(formData).unwrap();
      setUploadFile(null);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  // Save updated profile settings via mutation hook
  const handleProfileSave = async () => {
    try {
      await updatePhotographerProfile(photographerDetails).unwrap();
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Profile update failed", error);
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed z-50 bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Camera className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 z-40 w-64 h-full bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 flex items-center border-b border-gray-100 dark:border-gray-700">
          <Camera className="text-purple-600 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            SnapShoot
          </h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "dashboard"
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <User className="mr-3 h-5 w-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("portfolio");
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "portfolio"
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Camera className="mr-3 h-5 w-5" />
                <span>Portfolio</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("appointments");
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "appointments"
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Calendar className="mr-3 h-5 w-5" />
                <span>Appointments</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("messages");
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "messages"
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                <span>Messages</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "settings"
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        {activeTab === "dashboard" && (
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                Welcome back, {user?.name || "Photographer"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Let's check what's happening today.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Profile Overview Card */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Profile Overview
                  </h2>
                  <button className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                    <Edit className="h-4 w-4 mr-1" /> Edit Profile
                  </button>
                </div>
                <div className="flex items-center mb-4">
                  <img
                    src={
                      user?.profileImage ||
                      "/placeholder.svg?height=64&width=64"
                    }
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {user?.name || "Your Name"}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          photographerDetails.applicationStatus === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        }`}
                      >
                        {photographerDetails.applicationStatus || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {photographerDetails.bio ||
                    "Add a bio to tell clients about yourself and your photography style."}
                </p>
                <div className="border-t pt-4 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Hourly Rate
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      NPR {photographerDetails.hourlyRate || "0"}/hr
                    </span>
                  </div>
                  {photographerDetails.specialty && (
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      <div>
                        <strong>Specialty:</strong>{" "}
                        {photographerDetails.specialty}
                      </div>
                      <div>
                        <strong>Experience:</strong>{" "}
                        {photographerDetails.experience || "Not specified"}
                      </div>
                      <div>
                        <strong>Location:</strong>{" "}
                        {photographerDetails.location || "Not specified"}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Equipment List */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Equipment
                  </h2>
                </div>
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Add new equipment..."
                      value={newEquipment}
                      onChange={(e) => setNewEquipment(e.target.value)}
                    />
                    <button
                      className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm"
                      onClick={handleAddEquipment}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Adding..." : "Add"}
                    </button>
                  </div>
                </div>
                <ul className="space-y-2">
                  {(photographerDetails.equipment || []).map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item}
                      </span>
                      <button
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        onClick={() => handleRemoveEquipment(index)}
                        disabled={isUpdating}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                  {(photographerDetails.equipment || []).length === 0 && (
                    <li className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400 text-center italic">
                      No equipment added yet
                    </li>
                  )}
                </ul>
              </div>

              {/* Upcoming Bookings */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Upcoming Bookings
                  </h2>
                  <button
                    className="text-sm text-purple-600 dark:text-purple-400 flex items-center"
                    onClick={() => setActiveTab("appointments")}
                  >
                    View all <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {bookingsLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                    </div>
                  ) : (
                    bookingRequests
                      .filter((request) => request.status === "confirmed")
                      .slice(0, 3)
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-b-0"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-white">
                                {booking.client?.name || "Client"}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(booking.date).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {booking.startTime} - {booking.endTime}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-1 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                                <MessageSquare className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                                <Video className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                  {!bookingsLoading &&
                    bookingRequests.filter(
                      (request) => request.status === "confirmed"
                    ).length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
                        No upcoming bookings
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Portfolio Preview */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Portfolio Preview
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="hidden"
                    id="uploadPortfolio"
                  />
                  <label
                    htmlFor="uploadPortfolio"
                    className="flex items-center cursor-pointer text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    <Upload className="h-4 w-4 mr-2" /> Choose File
                  </label>
                  <button
                    onClick={handlePortfolioImageUpload}
                    className="flex items-center text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    disabled={!uploadFile || isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {portfolioLoading ? (
                  <div className="col-span-full flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                  </div>
                ) : (
                  portfolioImages.map((image, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden h-24 sm:h-32 bg-gray-100 dark:bg-gray-700 relative group"
                    >
                      <img
                        src={
                          `/uploads/${image}` ||
                          "/placeholder.svg?height=128&width=128"
                        }
                        alt={`Portfolio ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                )}
                {!portfolioLoading && portfolioImages.length === 0 && (
                  <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400 italic">
                    No portfolio images yet. Upload some to showcase your work!
                  </div>
                )}
              </div>
            </div>

            {/* Recent Booking Requests */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Recent Booking Requests
                </h2>
                <button
                  className="text-sm text-purple-600 dark:text-purple-400 flex items-center"
                  onClick={() => setActiveTab("appointments")}
                >
                  View all <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {bookingsLoading ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 sm:px-6 py-4 text-center"
                        >
                          <div className="flex justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      bookingRequests
                        .filter((request) => request.status === "pending")
                        .map((request) => (
                          <tr key={request.id}>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {request.client?.name || "Client"}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {new Date(request.date).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {request.startTime} - {request.endTime}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  request.status === "pending"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                    : request.status === "confirmed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                }`}
                              >
                                {request.status.charAt(0).toUpperCase() +
                                  request.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                                  Accept
                                </button>
                                <button className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
                                  Decline
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                    {!bookingsLoading &&
                      bookingRequests.filter(
                        (request) => request.status === "pending"
                      ).length === 0 && (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400 italic"
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
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                Portfolio Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Upload and manage your photography work
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Your Portfolio
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="hidden"
                    id="uploadPortfolioImage"
                  />
                  <label
                    htmlFor="uploadPortfolioImage"
                    className="flex items-center cursor-pointer text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    <Upload className="h-4 w-4 mr-2" /> Choose File
                  </label>
                  <button
                    onClick={handlePortfolioImageUpload}
                    className="flex items-center text-sm bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    disabled={!uploadFile || isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {portfolioLoading ? (
                  <div className="col-span-full flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                  </div>
                ) : (
                  portfolioImages.map((image, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden h-24 sm:h-32 bg-gray-100 dark:bg-gray-700 relative group"
                    >
                      <img
                        src={
                          `/uploads/${image}` ||
                          "/placeholder.svg?height=128&width=128"
                        }
                        alt={`Portfolio ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                )}
                {!portfolioLoading && portfolioImages.length === 0 && (
                  <div className="col-span-full py-8 text-center text-gray-500 dark:text-gray-400 italic">
                    No portfolio images yet. Upload some to showcase your work!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                Appointments
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your upcoming bookings and requests
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Booking Requests
                </h2>
                <div className="space-y-4">
                  {bookingsLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                    </div>
                  ) : (
                    bookingRequests
                      .filter((request) => request.status === "pending")
                      .map((request) => (
                        <div
                          key={request.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-white">
                                {request.client?.name || "Client"}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(request.date).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {request.startTime} - {request.endTime}
                              </p>
                            </div>
                            <div className="flex gap-2 self-end sm:self-center">
                              <button className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                                Accept
                              </button>
                              <button className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
                                Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                  {!bookingsLoading &&
                    bookingRequests.filter(
                      (request) => request.status === "pending"
                    ).length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
                        No pending requests
                      </p>
                    )}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Confirmed Bookings
                </h2>
                <div className="space-y-4">
                  {bookingsLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                    </div>
                  ) : (
                    bookingRequests
                      .filter((request) => request.status === "confirmed")
                      .map((request) => (
                        <div
                          key={request.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-white">
                                {request.client?.name || "Client"}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(request.date).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {request.startTime} - {request.endTime}
                              </p>
                            </div>
                            <div className="flex gap-2 self-end sm:self-center">
                              <button className="p-1 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                                <MessageSquare className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                                <Video className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                  {!bookingsLoading &&
                    bookingRequests.filter(
                      (request) => request.status === "confirmed"
                    ).length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
                        No confirmed bookings
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="mt-8 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Booking Calendar
              </h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  Calendar view would be implemented here
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                Messages
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Communicate with your clients
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                    Your Messages
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md px-4">
                    Stay connected with your clients through secure messaging.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your account preferences
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Profile Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    value={user?.name || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    rows="4"
                    value={photographerDetails.bio || ""}
                    onChange={(e) =>
                      setPhotographerDetails({
                        ...photographerDetails,
                        bio: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hourly Rate (NPR)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    value={photographerDetails.hourlyRate || ""}
                    onChange={(e) =>
                      setPhotographerDetails({
                        ...photographerDetails,
                        hourlyRate: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="pt-4 flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    onClick={handleProfileSave}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Bell (Fixed Position) */}
        <div className="fixed top-4 right-4 z-20">
          <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotographerDashboard;
