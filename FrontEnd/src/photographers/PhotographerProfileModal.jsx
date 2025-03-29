import React, { useState, useEffect } from "react";
import { Star, Camera, MapPin, DollarSign, Calendar, X } from "lucide-react";
import { useGetPhotographerDetailsQuery } from "../redux/api/photographerApi";
import { useCreateBookingMutation } from "../redux/api/bookingApi";
import { format, parseISO, differenceInMinutes } from "date-fns";

const PhotographerProfileModal = ({ photographerId, isOpen, onClose }) => {
  const {
    data: photographer,
    isLoading,
    isError,
  } = useGetPhotographerDetailsQuery(photographerId);
  const [createBooking] = useCreateBookingMutation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Debug: log photographer details
  useEffect(() => {
    if (photographer) {
      console.log("Photographer details:", photographer);
    }
  }, [photographer]);

  if (!isOpen) return null;
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-center text-lg">Loading photographer details...</p>
        </div>
      </div>
    );
  }
  if (isError || !photographer) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-center text-lg text-red-500">
            Error loading photographer details
          </p>
        </div>
      </div>
    );
  }

  // Extract available dates from photographer.availability
  const availableDates =
    photographer.availability && typeof photographer.availability === "object"
      ? Object.entries(photographer.availability)
          .filter(([_, dayInfo]) => dayInfo.available)
          .map(([date]) => date)
      : [];

  const handleBooking = async () => {
    if (!selectedDate || !startTime || !endTime) {
      alert("Please select a date, start time, and end time");
      return;
    }

    // Calculate duration in hours (or minutes, then convert)
    const durationInMinutes = differenceInMinutes(
      new Date(`${selectedDate}T${endTime}`),
      new Date(`${selectedDate}T${startTime}`)
    );
    if (durationInMinutes <= 0) {
      alert("End time must be after start time");
      return;
    }
    const duration = durationInMinutes / 60; // duration in hours

    // Calculate total price
    const totalPrice = photographer.hourlyRate * duration;
    const bookingData = {
      photographerId: photographer.id,
      date: selectedDate,
      startTime,
      endTime,
      duration,
      location: photographer.location || "",
      sessionType: "session",
      notes: "",
      totalPrice,
      status: "pending",
      paymentStatus: "pending",
    };

    try {
      await createBooking(bookingData).unwrap();
      alert("Booking successful!");
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
    }
  };

  // Determine display image
  const displayImage =
    photographer.portfolioImages?.[0] ||
    photographer.users?.profileImage ||
    "/placeholder-photographer.jpg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-60"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Photographer Image and Basic Info */}
          <div>
            <img
              src={displayImage}
              alt={photographer.users?.name || "Photographer"}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-purple-800">
                {photographer.users?.name || "No Name"}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span>
                    {photographer.averageRating
                      ? photographer.averageRating.toFixed(1)
                      : "No ratings"}{" "}
                    / 5
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>
                    {photographer.location || "Location not provided"}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <span>{photographer.hourlyRate} / hour</span>
              </div>
            </div>
          </div>
          {/* Detailed Information and Booking */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">
                Book {photographer.users?.name || "Photographer"}
              </h2>
              <p className="text-gray-600">
                {photographer.bio || "No biography available."}
              </p>
            </div>

            {/* Specialties */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Camera className="mr-2 text-purple-600" />
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {photographer.specialties?.map((specialty) => (
                  <span
                    key={specialty.id}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    {specialty.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability and Booking */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Calendar className="mr-2 text-purple-600" />
                Book a Session
              </h3>
              {/* Date Selection */}
              <div className="mb-4">
                <label className="block mb-2 font-medium">Select Date</label>
                <select
                  value={selectedDate || ""}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                  }}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">
                    {availableDates.length > 0
                      ? "Select a date"
                      : "No dates available"}
                  </option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {format(parseISO(date), "MMMM dd, yyyy")}
                    </option>
                  ))}
                </select>
              </div>
              {/* Time Selection */}
              {selectedDate && (
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Select Time</label>
                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="block mb-1">Start Time</label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">End Time</label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Booking Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !startTime || !endTime}
                className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                  !selectedDate || !startTime || !endTime
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                }`}
              >
                Book Photographer
              </button>
            </div>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="bg-gray-50 p-8">
          <h3 className="text-2xl font-bold mb-6">Recent Reviews</h3>
          {photographer.reviews?.length > 0 ? (
            photographer.reviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg p-4 mb-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">
                    {review.users?.name || "Anonymous"}
                  </h4>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="text-yellow-500 w-4 h-4 fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotographerProfileModal;
