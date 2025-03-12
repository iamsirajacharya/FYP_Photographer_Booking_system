// PhotographerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ApiLink from "../../api";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";

const PhotographerProfile = () => {
  const { id } = useParams();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking form fields
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const fetchPhotographer = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${ApiLink.getPhotographer.url}/${id}`);
        setPhotographer(res.data.photographer);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load photographer details");
      } finally {
        setLoading(false);
      }
    };
    fetchPhotographer();
  }, [id]);

  const handleBookNow = async () => {
    setBookingError("");
    if (!startTime || !endTime) {
      setBookingError("Please select start and end time.");
      return;
    }
    try {
      const token = localStorage.getItem("token"); // or from Redux
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const payload = {
        photographerId: photographer.id,
        startTime,
        endTime,
      };
      // POST booking request (assumed to be at /book)
      const res = await axios.post(
        ApiLink.bookPhotographer.url,
        payload,
        config
      );
      if (res.data.ok) {
        alert("Booking request sent successfully!");
      } else {
        setBookingError(res.data.message || "Booking failed.");
      }
    } catch (err) {
      console.error(err);
      setBookingError("Failed to create booking.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!photographer) return <p>Photographer not found.</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{photographer.name}</h1>
        <p className="text-gray-600 mb-2">Price: ₹{photographer.price}/hr</p>
        <p className="text-gray-600 mb-2">Address: {photographer.address}</p>
        <p className="text-gray-600 mb-2">Camera: {photographer.camera}</p>
        <p className="text-gray-600 mb-2">
          Expertise: {photographer.expertise}
        </p>
        {/* Display all images */}
        <div className="grid grid-cols-2 gap-2 my-4">
          {photographer.images?.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={`img-${idx}`}
              className="w-full object-cover"
            />
          ))}
        </div>

        {/* Booking Form */}
        <div className="mt-6 p-4 border rounded bg-white">
          <h2 className="text-xl font-semibold mb-2">Book This Photographer</h2>
          {bookingError && <p className="text-red-500">{bookingError}</p>}
          <label className="block mb-1">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 w-full mb-4"
          />
          <label className="block mb-1">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 w-full mb-4"
          />
          <button
            onClick={handleBookNow}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Book Now
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PhotographerProfile;
