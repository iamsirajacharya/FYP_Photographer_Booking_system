import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Loading skeleton
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
      <div className="relative w-full h-64 bg-gradient-to-r from-purple-600 to-blue-500 overflow-hidden">
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-12">
        {/* Sidebar Example */}
        <nav>
          <ul>
            <li>
              <button onClick={() => setActiveTab("overview")}>Overview</button>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </nav>

        {/* Profile Info Example */}
        {activeTab === "overview" && (
          <div>
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <img
              src={profile.avatar || "/placeholder.svg"}
              alt={profile.name}
              className="w-32 h-32 rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
