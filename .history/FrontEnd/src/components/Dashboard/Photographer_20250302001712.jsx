import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Common/Navbar";

const Photographer = () => {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [eventType, setEventType] = useState("");

  useEffect(() => {
    axios
      .get("https://api.example.com/photographers") // Replace with your API endpoint
      .then((response) => {
        setPhotographers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load photographers.");
        setLoading(false);
      });
  }, []);

  const filteredPhotographers = photographers.filter(
    (photographer) =>
      (searchLocation
        ? photographer.location
            .toLowerCase()
            .includes(searchLocation.toLowerCase())
        : true) &&
      (eventType
        ? photographer.specialty.toLowerCase().includes(eventType.toLowerCase())
        : true)
  );

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">
          Find a Photographer
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
          <input
            type="text"
            placeholder="Search by location"
            className="p-3 bg-gray-800 rounded w-full md:w-1/3"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <select
            className="p-3 bg-gray-800 rounded w-full md:w-1/3"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">Select Event Type</option>
            <option value="wedding">Wedding</option>
            <option value="portrait">Portrait</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotographers.map((photographer) => (
            <div
              key={photographer.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
            >
              <img
                src={photographer.profilePicture}
                alt={photographer.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{photographer.name}</h3>
              <p className="text-gray-400">{photographer.location}</p>
              <p className="text-sm text-gray-300 mt-2">
                Specialty: {photographer.specialty}
              </p>
              <button className="mt-4 w-full bg-purple-600 hover:bg-purple-500 py-2 rounded text-white font-bold">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photographer;
