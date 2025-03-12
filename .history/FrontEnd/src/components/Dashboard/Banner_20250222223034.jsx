import React, { useState } from "react";

const Banner = () => {
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!location || !eventType) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    // Handle search logic here
  };

  return (
    <div className="relative bg-gray-900 h-[600px]">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent">
        <img
          src="/api/placeholder/1920/600"
          alt="Wedding couple"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Find & Book the Best
            <br />
            Photographers in Nepal!
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
            Connect with 100+ photographers for your special moments like
            weddings, special occasions, and guaranteed satisfaction.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 max-w-4xl"
          >
            <div className="flex-1">
              <input
                type="text"
                placeholder="Location"
                className="w-full px-4 py-3 rounded-md bg-white"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <select
                className="w-full px-4 py-3 rounded-md bg-white"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                <option value="">Event Type</option>
                <option value="wedding">Wedding</option>
                <option value="portrait">Portrait</option>
                <option value="event">Event</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-700 transition-colors"
            >
              Search Now
            </button>
          </form>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Banner;
