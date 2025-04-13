"use client";

importreact, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  CreditCard,
  Edit,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Settings,
  Shield,
  Star,
  User,
  Camera,
  ChevronRight,
  Clock,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "Alexandra Reynolds",
    email: "alexandra.reynolds@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Photography enthusiast with a passion for capturing special moments. I've been working with professional photographers for over 5 years for various events and personal photoshoots.",
    avatar: "/placeholder.svg?height=200&width=200",
    coverPhoto: "/placeholder.svg?height=400&width=1200",
    memberSince: "January 2020",
    bookingsCompleted: 12,
    favoritePhotographers: 8,
  });

  const [formData, setFormData] = useState({ ...profile });

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setProfile(formData);
      setIsEditing(false);
      setIsLoading(false);
    }, 800);
  };

  const bookings = [
    {
      id: "BK-2023-001",
      photographerName: "Michael Chen",
      photographerAvatar: "/placeholder.svg?height=50&width=50",
      date: "March 15, 2023",
      time: "10:00 AM - 12:00 PM",
      location: "Central Park, NY",
      status: "completed",
      type: "Portrait Session",
      price: "$250",
    },
    {
      id: "BK-2023-002",
      photographerName: "Sarah Johnson",
      photographerAvatar: "/placeholder.svg?height=50&width=50",
      date: "May 22, 2023",
      time: "4:00 PM - 6:00 PM",
      location: "Brooklyn Bridge, NY",
      status: "completed",
      type: "Engagement Photos",
      price: "$350",
    },
    {
      id: "BK-2023-003",
      photographerName: "David Williams",
      photographerAvatar: "/placeholder.svg?height=50&width=50",
      date: "August 10, 2023",
      time: "1:00 PM - 3:00 PM",
      location: "Studio 42, Manhattan",
      status: "completed",
      type: "Professional Headshots",
      price: "$200",
    },
    {
      id: "BK-2024-001",
      photographerName: "Emily Rodriguez",
      photographerAvatar: "/placeholder.svg?height=50&width=50",
      date: "April 5, 2024",
      time: "3:00 PM - 5:00 PM",
      location: "High Line Park, NY",
      status: "upcoming",
      type: "Family Photoshoot",
      price: "$300",
    },
  ];

  const favoritePhotographers = [
    {
      id: 1,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=80&width=80",
      specialty: "Portrait Photography",
      rating: 4.9,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=80&width=80",
      specialty: "Wedding Photography",
      rating: 4.8,
    },
    {
      id: 3,
      name: "David Williams",
      avatar: "/placeholder.svg?height=80&width=80",
      specialty: "Commercial Photography",
      rating: 4.7,
    },
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "05/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8888",
      expiry: "09/26",
      isDefault: false,
    },
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse mb-4"></div>
                  <div className="h-6 w-48 bg-gray-200 animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 animate-pulse mb-6"></div>
                </div>
                <div className="space-y-4 mt-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-200 animate-pulse rounded"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="h-8 w-48 bg-gray-200 animate-pulse mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-200 animate-pulse rounded"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
      <div className="relative w-full h-64 bg-gradient-to-r from-purple-600 to-blue-500 overflow-hidden">
        <Image
          src={profile.coverPhoto || "/placeholder.svg"}
          alt="Cover photo"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-4 left-4 md:left-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          <p className="text-sm md:text-base opacity-90">
            Manage your account and bookings
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={profile.avatar || "/placeholder.svg"}
                      alt={profile.name}
                      width={128}
                      height={128}
                      className="object-cover"
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
                  <span>Member since {profile.memberSince}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-6 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {profile.bookingsCompleted}
                    </p>
                    <p className="text-xs text-gray-500">Bookings</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {profile.favoritePhotographers}
                    </p>
                    <p className="text-xs text-gray-500">Favorites</p>
                  </div>
                </div>
              </div>

              <nav className="mt-2">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                        activeTab === "overview"
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <User className="mr-3 h-5 w-5" />
                      <span>Overview</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                        activeTab === "bookings"
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Calendar className="mr-3 h-5 w-5" />
                      <span>My Bookings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("favorites")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                        activeTab === "favorites"
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Heart className="mr-3 h-5 w-5" />
                      <span>Favorite Photographers</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("payments")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                        activeTab === "payments"
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <CreditCard className="mr-3 h-5 w-5" />
                      <span>Payment Methods</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                        activeTab === "settings"
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Settings className="mr-3 h-5 w-5" />
                      <span>Account Settings</span>
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/logout"
                      className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Logout</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center mb-4">
                <Camera className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-semibold">Need a photographer?</h3>
              </div>
              <p className="text-purple-100 mb-4">
                Book your next photoshoot with our top-rated professionals.
              </p>
              <Link
                href="/photographers"
                className="block w-full bg-white text-purple-700 text-center py-2 px-4 rounded-lg font-medium hover:bg-purple-50 transition"
              >
                Find Photographers
              </Link>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:w-2/3">
            {/* Edit Profile Form */}
            {isEditing ? (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Edit Profile
                  </h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      ></textarea>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <div className="flex items-center">
                        <input type="file" id="avatar" className="hidden" />
                        <label
                          htmlFor="avatar"
                          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Change Profile Photo
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <>
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                          Personal Information
                        </h2>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center text-purple-600 hover:text-purple-800"
                        >
                          <Edit size={16} className="mr-1" />
                          <span>Edit</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Email
                            </p>
                            <p className="text-gray-800">{profile.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Phone
                            </p>
                            <p className="text-gray-800">{profile.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Location
                            </p>
                            <p className="text-gray-800">{profile.location}</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Bio
                            </p>
                            <p className="text-gray-800">{profile.bio}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Recent Bookings
                      </h2>

                      <div className="space-y-4">
                        {bookings.slice(0, 2).map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                          >
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                <Image
                                  src={
                                    booking.photographerAvatar ||
                                    "/placeholder.svg"
                                  }
                                  alt={booking.photographerName}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800">
                                  {booking.type}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {booking.date} • {booking.photographerName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  booking.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {booking.status === "completed"
                                  ? "Completed"
                                  : "Upcoming"}
                              </span>
                              <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setActiveTab("bookings")}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          View all bookings
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Favorite Photographers
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoritePhotographers
                          .slice(0, 3)
                          .map((photographer) => (
                            <div
                              key={photographer.id}
                              className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition"
                            >
                              <div className="flex items-center mb-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                  <Image
                                    src={
                                      photographer.avatar || "/placeholder.svg"
                                    }
                                    alt={photographer.name}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-800">
                                    {photographer.name}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    {photographer.specialty}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  <span className="text-sm font-medium">
                                    {photographer.rating}
                                  </span>
                                </div>
                                <Link
                                  href={`/photographers/${photographer.id}`}
                                  className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                                >
                                  View Profile
                                </Link>
                              </div>
                            </div>
                          ))}
                      </div>

                      {favoritePhotographers.length > 3 && (
                        <div className="mt-4 text-center">
                          <button
                            onClick={() => setActiveTab("favorites")}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            View all favorites
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Bookings Tab */}
                {activeTab === "bookings" && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">
                        My Bookings
                      </h2>
                      <Link
                        href="/photographers"
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Book New Session
                      </Link>
                    </div>

                    <div className="flex border-b border-gray-200 mb-6">
                      <button className="px-4 py-2 text-purple-600 border-b-2 border-purple-600 font-medium">
                        All Bookings
                      </button>
                      <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                        Upcoming
                      </button>
                      <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                        Completed
                      </button>
                      <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                        Canceled
                      </button>
                    </div>

                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6">
                            <div className="flex items-center mb-4 sm:mb-0">
                              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                <Image
                                  src={
                                    booking.photographerAvatar ||
                                    "/placeholder.svg"
                                  }
                                  alt={booking.photographerName}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h3 className="font-medium text-gray-800">
                                    {booking.type}
                                  </h3>
                                  <span
                                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      booking.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : booking.status === "upcoming"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {booking.status === "completed"
                                      ? "Completed"
                                      : booking.status === "upcoming"
                                      ? "Upcoming"
                                      : "Canceled"}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Booking ID: {booking.id}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-800">
                                {booking.price}
                              </p>
                              <p className="text-sm text-gray-500">
                                {booking.date}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between text-sm">
                            <div className="flex items-center mr-4 mb-2 sm:mb-0">
                              <User className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{booking.photographerName}</span>
                            </div>
                            <div className="flex items-center mr-4 mb-2 sm:mb-0">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center mb-2 sm:mb-0">
                              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{booking.location}</span>
                            </div>
                            <div className="flex-shrink-0 mt-2 sm:mt-0">
                              <Link
                                href={`/bookings/${booking.id}`}
                                className="text-purple-600 hover:text-purple-800 font-medium"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Favorites Tab */}
                {activeTab === "favorites" && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                      Favorite Photographers
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      {favoritePhotographers.map((photographer) => (
                        <div
                          key={photographer.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                                <Image
                                  src={
                                    photographer.avatar || "/placeholder.svg"
                                  }
                                  alt={photographer.name}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800">
                                  {photographer.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {photographer.specialty}
                                </p>
                                <div className="flex items-center mt-1">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  <span className="text-sm font-medium">
                                    {photographer.rating}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Link
                                href={`/photographers/${photographer.id}`}
                                className="px-4 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition text-center"
                              >
                                View Profile
                              </Link>
                              <button className="px-4 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition">
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 text-center">
                      <Link
                        href="/photographers"
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Discover More Photographers
                      </Link>
                    </div>
                  </div>
                )}

                {/* Payments Tab */}
                {activeTab === "payments" && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">
                        Payment Methods
                      </h2>
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        Add New Card
                      </button>
                    </div>

                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center mr-4">
                                {method.type === "Visa" ? (
                                  <span className="text-blue-700 font-bold text-sm">
                                    VISA
                                  </span>
                                ) : (
                                  <span className="text-red-600 font-bold text-sm">
                                    MC
                                  </span>
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800">
                                  {method.type} •••• {method.last4}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Expires {method.expiry}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {method.isDefault && (
                                <span className="mr-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Default
                                </span>
                              )}
                              <button className="text-gray-400 hover:text-gray-600">
                                <Edit size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-800">
                            Secure Payment Processing
                          </h3>
                          <p className="text-sm text-gray-500">
                            All payment information is encrypted and securely
                            processed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === "settings" && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                      Account Settings
                    </h2>

                    <div className="space-y-6">
                      <div className="pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                          Email Notifications
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-700">
                                Booking Confirmations
                              </p>
                              <p className="text-sm text-gray-500">
                                Receive emails when your booking is confirmed
                              </p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input
                                type="checkbox"
                                id="booking-confirmations"
                                defaultChecked
                                className="sr-only"
                              />
                              <div className="block h-6 bg-gray-200 rounded-full w-12"></div>
                              <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-700">
                                Booking Reminders
                              </p>
                              <p className="text-sm text-gray-500">
                                Receive reminders before your scheduled bookings
                              </p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input
                                type="checkbox"
                                id="booking-reminders"
                                defaultChecked
                                className="sr-only"
                              />
                              <div className="block h-6 bg-gray-200 rounded-full w-12"></div>
                              <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-700">
                                Promotional Emails
                              </p>
                              <p className="text-sm text-gray-500">
                                Receive special offers and promotions
                              </p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input
                                type="checkbox"
                                id="promotional-emails"
                                className="sr-only"
                              />
                              <div className="block h-6 bg-gray-200 rounded-full w-12"></div>
                              <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                          Password
                        </h3>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                          Change Password
                        </button>
                      </div>

                      <div className="pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                          Privacy
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-700">
                                Profile Visibility
                              </p>
                              <p className="text-sm text-gray-500">
                                Allow photographers to see your profile
                              </p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input
                                type="checkbox"
                                id="profile-visibility"
                                defaultChecked
                                className="sr-only"
                              />
                              <div className="block h-6 bg-gray-200 rounded-full w-12"></div>
                              <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                          Account
                        </h3>
                        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
