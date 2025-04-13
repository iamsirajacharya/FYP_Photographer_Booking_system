import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Heart,
  Settings,
  Edit,
  Camera,
} from "lucide-react";
import { Header } from "../../UI/header";
import { useGetCurrentUserQuery } from "../redux/api/authApi"; // Updated hook

const ProfilePage = () => {
  const { data: profile, isLoading, isError, error } = useGetCurrentUserQuery();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  // Initialize form data when profile is fetched
  useEffect(() => {
    if (profile) {
      // Depending on how your server response is structured,
      // adjust here if needed (e.g., profile.user vs. profile directly)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    setIsEditing(false);
    // Trigger mutation here (e.g., useUpdateUserProfileMutation)
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
                      src={profile.avatar || "/placeholder.svg"}
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
                <p className="text-gray-500 mb-2">{profile.location}</p>
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
            {isEditing ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData?.location || ""}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData?.bio || ""}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded"
                      rows="3"
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
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                <p>
                  <strong>Name:</strong> {profile.name}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
                <p>
                  <strong>Location:</strong> {profile.location}
                </p>
                <p>
                  <strong>Bio:</strong> {profile.bio}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
