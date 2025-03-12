// AllPhotographers.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ApiLink from "../../api";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { useNavigate } from "react-router-dom";

const Photographers = () => {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  const fetchPhotographers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchLocation) queryParams.append("location", searchLocation);
      if (eventType) queryParams.append("specialty", eventType);
      if (sortOrder) queryParams.append("Sortby", sortOrder);

      const url = `${ApiLink.photographersWithImages.url}?${queryParams}`;
      const res = await axios.get(url);
      setPhotographers(res.data.photographers || []);
      setError(null);
    } catch (err) {
      setError("Failed to load photographers.");
      setPhotographers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotographers();
  }, [searchLocation, eventType, sortOrder]);

  const handleViewProfile = (id) => {
    navigate(`/photographer/${id}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="px-6 py-24 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Find a Photographer
        </h2>

        {/* Filters omitted for brevity */}

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photographers.map((photographer) => (
            <div
              key={photographer.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {photographer.sampleImage ? (
                <img
                  src={photographer.sampleImage}
                  alt={`${photographer.name}-sample`}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No Image</p>
                </div>
              )}
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    {photographer.name}
                  </h3>
                  <p className="text-pink-600 font-bold">
                    ₹{photographer.price}/hr
                  </p>
                </div>
                <p className="text-gray-600">{photographer.address}</p>
                <button
                  className="mt-3 w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 font-semibold"
                  onClick={() => handleViewProfile(photographer.id)}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Photographers;
