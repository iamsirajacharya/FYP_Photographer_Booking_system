// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  CreditCard,
  Heart,
  Settings,
  Edit,
} from "lucide-react";
import { Header } from "../../UI/header";
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from "../redux/api/authApi";
import {
  useGetClientBookingsQuery,
  // useGetClientPaymentsQuery, // make sure this hook is defined in your bookingApi
} from "../redux/api/bookingApi";

// Component to list bookings
const BookingsList = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return <p className="text-gray-600">No bookings found.</p>;
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mt-10"
        >
          {/* Header Row: Booking Number & Status Label */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Booking #{booking.bookingNumber}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                ${
                  booking.status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : booking.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : booking.status === "completed"
                    ? "bg-blue-100 text-blue-800"
                    : booking.status === "canceled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
            >
              {booking.status}
            </span>
          </div>

          {/* Booking Details */}
          <div className="text-gray-700 space-y-1">
            <p>
              <strong>Date:</strong> {booking.date}
            </p>
            <p>
              <strong>Time:</strong> {booking.startTime} - {booking.endTime}
            </p>
            <p>
              <strong>Total Price:</strong> {booking.totalPrice}
            </p>
            {/* Add more details if needed, for example location or sessionType */}
            {booking.location && (
              <p>
                <strong>Location:</strong> {booking.location}
              </p>
            )}
            {booking.sessionType && (
              <p>
                <strong>Session Type:</strong> {booking.sessionType}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Component to list payments
const PaymentList = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return <p>No payments found.</p>;
  }
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Your Payments</h3>
      <ul className="space-y-4">
        {payments.map((payment) => (
          <li key={payment.id} className="border p-4 rounded-lg">
            <p>
              <strong>Transaction ID:</strong> {payment.transactionId}
            </p>
            <p>
              <strong>Amount:</strong> {payment.amount}
            </p>
            <p>
              <strong>Method:</strong> {payment.paymentMethod}
            </p>
            <p>
              <strong>Status:</strong> {payment.status}
            </p>
            <p>
              <strong>Payment Date:</strong>{" "}
              {new Date(payment.paymentDate).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProfilePage = () => {
  // Fetch current user profile
  const { data, isLoading, isError, error, refetch } = useGetCurrentUserQuery();
  const profile = data?.user;

  // Fetch client bookings
  const {
    data: clientBookings,
    isLoading: clientBookingsLoading,
    isError: clientBookingsError,
  } = useGetClientBookingsQuery();

  // // Fetch client payments
  // const {
  //   data: clientPayments,
  //   isLoading: paymentsLoading,
  //   isError: paymentsError,
  // } = useGetClientPaymentsQuery();

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [formData, setFormData] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  // Mutation hooks for profile and password update
  const [
    updateProfile,
    { isLoading: updatingProfile, error: updateProfileError },
  ] = useUpdateProfileMutation();
  const [
    updatePassword,
    { isLoading: updatingPassword, error: updatePasswordError },
  ] = useUpdatePasswordMutation();

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    if (file) {
      formDataToSend.append("profileImage", file);
    }
    try {
      await updateProfile(formDataToSend).unwrap();
      setIsEditing(false);
      refetch();
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(passwordForm).unwrap();
      setIsEditingPassword(false);
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Password update failed", err);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen pt-16">Loading Profile...</div>;
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-16 text-red-500">
        Error loading profile: {error?.message || "Unknown error"}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="relative w-full h-48 bg-gradient-to-r from-purple-600 to-blue-500 overflow-hidden">
        <img
          src={profile.coverPhoto || "/placeholder.svg"}
          alt="Cover photo"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-4 left-4 md:left-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          <p className="text-sm md:text-base opacity-90">
            Manage your account and bookings
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={
                        `http://localhost:3000${profile.profileImage}` ||
                        "/placeholder.svg"
                      }
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-md hover:bg-purple-700 transition"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit size={16} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {profile.name}
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <span>
                    Member since{" "}
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <nav className="mt-6">
                <ul className="space-y-1">
                  {[
                    "overview",
                    "bookings",
                    "favorites",
                    "payments",
                    "settings",
                  ].map((tab) => (
                    <li key={tab}>
                      <button
                        onClick={() => setActiveTab(tab)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                          activeTab === tab
                            ? "bg-purple-50 text-purple-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {tab === "overview" && (
                          <User className="mr-3 h-5 w-5" />
                        )}
                        {tab === "bookings" && (
                          <Calendar className="mr-3 h-5 w-5" />
                        )}
                        {tab === "favorites" && (
                          <Heart className="mr-3 h-5 w-5" />
                        )}
                        {tab === "payments" && (
                          <CreditCard className="mr-3 h-5 w-5" />
                        )}
                        {tab === "settings" && (
                          <Settings className="mr-3 h-5 w-5" />
                        )}
                        <span>
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3">
            {activeTab === "overview" && (
              <>
                {isEditing ? (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profile Image
                        </label>
                        <input
                          type="file"
                          name="profileImage"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Profile Preview"
                            className="mt-2 h-20 w-20 object-cover rounded-full"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData?.name || ""}
                          onChange={handleInputChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData?.email || ""}
                          onChange={handleInputChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData?.phone || ""}
                          onChange={handleInputChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-purple-600 text-white rounded"
                          disabled={updatingProfile}
                        >
                          {updatingProfile ? "Saving..." : "Save"}
                        </button>
                      </div>
                      {updateProfileError && (
                        <p className="text-red-500 text-sm mt-2">
                          Error updating profile.
                        </p>
                      )}
                    </form>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">
                      Personal Information
                    </h2>
                    <p>
                      <strong>Name:</strong> {profile.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {profile.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {profile.phone}
                    </p>
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => setIsEditingPassword(true)}
                        className="px-4 py-2 bg-gray-600 text-white rounded"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                )}

                {isEditingPassword && (
                  <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-bold mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingPassword(false)}
                          className="px-4 py-2 border rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gray-600 text-white rounded"
                          disabled={updatingPassword}
                        >
                          {updatingPassword ? "Saving..." : "Save"}
                        </button>
                      </div>
                      {updatePasswordError && (
                        <p className="text-red-500 text-sm mt-2">
                          Error updating password.
                        </p>
                      )}
                    </form>
                  </div>
                )}
              </>
            )}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                {clientBookingsLoading ? (
                  <p>Loading bookings...</p>
                ) : clientBookingsError ? (
                  <p>Error loading bookings.</p>
                ) : (
                  <BookingsList bookings={clientBookings} />
                )}
              </div>
            )}
            {activeTab === "payments" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                {paymentsLoading ? (
                  <p>Loading payments...</p>
                ) : paymentsError ? (
                  <p>Error loading payments.</p>
                ) : (
                  <PaymentList payments={clientPayments} />
                )}
              </div>
            )}
            {/* You can add similar conditions for "favorites" and "settings" */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
