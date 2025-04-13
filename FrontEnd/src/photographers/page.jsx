import React, { useState } from "react";
import { Search, Star } from "lucide-react";
import {
  useGetPhotographersQuery,
  useGetPhotographerDetailsQuery,
} from "../redux/api/photographerApi";
import PhotographerProfileModal from "./PhotographerProfileModal";
import { Header } from "../../UI/header";

// Define the backend URL – adjust this if needed
const BACKEND_URL = "http://localhost:3000";

export default function PhotographerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhotographerId, setSelectedPhotographerId] = useState(null);

  // Fetch all photographers from your backend
  const {
    data: photographerData,
    isLoading,
    isError,
    error,
  } = useGetPhotographersQuery();

  // If a photographer is selected, fetch their details
  const { data: photographerDetails } = useGetPhotographerDetailsQuery(
    selectedPhotographerId,
    { skip: !selectedPhotographerId }
  );

  // The backend returns an object: { photographers: [...] }
  const photographerList = photographerData?.photographers || [];

  // Filter photographers based on search term
  const filteredPhotographers = photographerList.filter((p) => {
    const userName = p.users?.name?.toLowerCase() || "";
    const pSpecialty = p.specialty?.toLowerCase() || "";
    const pLocation = p.location?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    return (
      userName.includes(term) ||
      pSpecialty.includes(term) ||
      pLocation.includes(term)
    );
  });

  // Handle viewing a photographer's profile (opens modal)
  const handleViewProfile = (photographerId) => {
    console.log("View profile clicked:", photographerId);
    setSelectedPhotographerId(photographerId);
  };

  // Handle closing the modal
  const handleCloseProfile = () => {
    setSelectedPhotographerId(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Photographers</h1>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center text-xl text-gray-600">
            Loading photographers...
          </p>
        </main>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Photographers</h1>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center text-xl text-red-600">
            Error loading photographers: {error?.message || "Unknown error"}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar Filters */}
          <div className="space-y-6">
            {/* Search Filter */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                Search Photographers
              </h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Name, specialty, location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Photography Type Filter */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Photography Types</h3>
              <div className="space-y-2">
                {["Portrait", "Wedding", "Event", "Family", "Commercial"].map(
                  (type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-blue-600"
                      />
                      <span>{type}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <input
                type="range"
                min="0"
                max="300"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>$0</span>
                <span>$150</span>
                <span>$300+</span>
              </div>
            </div>
          </div>

          {/* Photographers Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {filteredPhotographers.length} Photographers Found
              </p>
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Grid View
                </button>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                  List View
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotographers.map((photographer) => {
                const photographerName = photographer.users?.name || "No Name";
                const photographerRating =
                  photographer.averageRating?.toFixed(1) || "N/A";
                // Profile image is stored in photographer.users.profileImage.
                // If it starts with "/uploads", prepend BACKEND_URL.
                const rawProfileImage =
                  photographer.users?.profileImage ||
                  "/placeholder-profile.jpg";
                const displayProfileImage = rawProfileImage.startsWith(
                  "/uploads"
                )
                  ? `${BACKEND_URL}${rawProfileImage}`
                  : rawProfileImage;

                return (
                  <div
                    key={photographer.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={displayProfileImage}
                      alt={photographerName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">
                        {photographerName}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {photographer.specialty || "No specialty provided"}
                      </p>
                      <p className="text-gray-600 mb-2">
                        {photographer.location || "No location provided"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{photographerRating}</span>
                        </div>
                        <button
                          onClick={() => handleViewProfile(photographer.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Photographer Profile Modal */}
        {selectedPhotographerId && (
          <PhotographerProfileModal
            photographerId={selectedPhotographerId}
            isOpen={!!selectedPhotographerId}
            onClose={handleCloseProfile}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-8">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600">
            &copy; 2024 Photographer Booking Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
