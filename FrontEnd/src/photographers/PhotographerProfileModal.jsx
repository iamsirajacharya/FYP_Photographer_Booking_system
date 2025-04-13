import { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  DollarSign,
  Calendar,
  X,
  MessageSquare,
} from "lucide-react";
import { useGetPhotographerDetailsQuery } from "../redux/api/photographerApi";
import {
  useGetPhotographerReviewsQuery,
  useCreateReviewMutation,
} from "../redux/api/reviewApi";
import { useCreateBookingMutation } from "../redux/api/bookingApi";
import { format, parseISO, differenceInMinutes } from "date-fns";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const PhotographerProfileModal = ({
  photographerId,
  isOpen,
  onClose,
  userBookings = [],
  userId,
}) => {
  const navigate = useNavigate(); // Initialize navigate

  const {
    data: photographer,
    isLoading,
    isError,
    refetch,
  } = useGetPhotographerDetailsQuery(photographerId);

  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    refetch: refetchReviews,
  } = useGetPhotographerReviewsQuery(photographerId, {
    skip: !photographerId,
  });

  const [createBooking] = useCreateBookingMutation();
  const [createReview] = useCreateReviewMutation();

  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activeTab, setActiveTab] = useState("booking"); // "booking" or "reviews"
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online"); // Default to online payment
  const [transactionId, setTransactionId] = useState(""); // For online payments

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

    // Validate payment method
    if (paymentMethod === "online" && !transactionId) {
      alert("Please enter a transaction ID for online payment");
      return;
    }

    const durationInMinutes = differenceInMinutes(
      new Date(`${selectedDate}T${endTime}`),
      new Date(`${selectedDate}T${startTime}`)
    );
    if (durationInMinutes <= 0) {
      alert("End time must be after start time");
      return;
    }
    const duration = durationInMinutes / 60;
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
      paymentMethod,
      transactionId: paymentMethod === "online" ? transactionId : null,
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

  const displayImage =
    photographer.portfolioImages?.[0] ||
    photographer.users?.profileImage ||
    "/placeholder-photographer.jpg";

  // Get reviews from the API response
  const reviews = reviewsData?.reviews || [];
  const hasAlreadyReviewed = reviews.some((review) => review.userId === userId);

  const handleSubmitReview = async () => {
    if (!rating) {
      alert("Please select a rating by clicking on the stars");
      return;
    }
    setIsSubmittingReview(true);

    try {
      const reviewData = {
        userId,
        photographerId,
        rating,
        comment,
      };

      await createReview(reviewData).unwrap();

      // Reset local review state
      setRating(0);
      setComment("");

      // Refetch photographer details and reviews to update the UI
      refetch();
      refetchReviews();

      alert("Thank you! Your review has been submitted successfully.");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert(
        "Failed to submit review. Please try again: " +
          (error?.data?.message || error.message)
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle starting a conversation by navigating to the messages page with a query parameter.
  const handleStartConversation = () => {
    // Create an initial message in localStorage to ensure it persists
    const photographerUserId = photographer.users?.id;
    if (photographerUserId) {
      // Store the conversation in localStorage for the client
      const initialConversation = {
        id: photographerUserId,
        name: photographer.users?.name || "Photographer",
        profileImage: photographer.users?.profileImage,
      };
      localStorage.setItem(
        "activeConversation",
        JSON.stringify(initialConversation)
      );

      // Initialize empty messages array if it doesn't exist
      if (!localStorage.getItem(`messages_${photographerUserId}`)) {
        localStorage.setItem(
          `messages_${photographerUserId}`,
          JSON.stringify([])
        );
      }

      // Also create the conversation entry for the photographer
      const clientInfo = {
        id: userId,
        name: "Client", // This should be replaced with actual client name if available
        image: "/placeholder.svg?height=64&width=64", // This should be replaced with actual client image if available
      };
      localStorage.setItem(
        "photographer_active_conversation",
        JSON.stringify(clientInfo)
      );

      // Initialize empty messages array for photographer if it doesn't exist
      if (!localStorage.getItem(`photographer_messages_${userId}`)) {
        localStorage.setItem(
          `photographer_messages_${userId}`,
          JSON.stringify([])
        );
      }

      // Navigate to the messages page with the photographer's user ID
      navigate(`/messages?userId=${photographerUserId}`);
    } else {
      alert(
        "Could not start conversation. Photographer information is incomplete."
      );
    }
  };

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
              src={displayImage || "/placeholder.svg"}
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
                  <span className="text-gray-500">
                    ({photographer.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
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
              {/* Start Conversation Button */}
              <div className="mt-4">
                <button
                  onClick={handleStartConversation}
                  className="flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Conversation
                </button>
              </div>
              {/* Quick Review Button */}
              <div className="mt-4">
                <button
                  onClick={() => setActiveTab("reviews")}
                  className="flex items-center justify-center w-full py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Write a Review
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Information and Booking/Reviews Tabs */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-purple-800">
                {photographer.users?.name || "Photographer"}
              </h2>
              <p className="text-gray-600">
                {photographer.bio || "No biography available."}
              </p>
            </div>

            <div className="mb-4 border-b">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("booking")}
                  className={`py-2 px-4 font-medium ${
                    activeTab === "booking"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Book a Session
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-2 px-4 font-medium ${
                    activeTab === "reviews"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <MessageSquare className="inline-block w-4 h-4 mr-1" />
                  Reviews ({photographer.reviewCount || 0})
                </button>
              </div>
            </div>

            {activeTab === "booking" ? (
              // Booking Form
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Calendar className="mr-2 text-purple-600" />
                  Book a Session
                </h3>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Select Date</label>
                  <select
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value)}
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
                {selectedDate && (
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">
                      Select Time
                    </label>
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

                {/* Payment Method Selection */}
                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  transactionId={transactionId}
                  setTransactionId={setTransactionId}
                />

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
            ) : (
              // Reviews Tab
              <div>
                <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Star className="mr-2 text-purple-600" />
                    Rate this Photographer
                  </h3>
                  {!hasAlreadyReviewed ? (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium mb-4">
                        Share your experience
                      </h4>

                      {/* Star Rating */}
                      <div className="mb-4">
                        <label className="block mb-2 font-medium">
                          Your Rating
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  rating >= star
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="mb-4">
                        <label
                          htmlFor="review-comment"
                          className="block mb-2 font-medium"
                        >
                          Your Review
                        </label>
                        <textarea
                          id="review-comment"
                          rows="4"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share details of your experience with this photographer..."
                          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        ></textarea>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleSubmitReview}
                          disabled={isSubmittingReview || !rating}
                          className={`px-6 py-2 rounded-md text-white ${
                            isSubmittingReview || !rating
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
                        >
                          {isSubmittingReview
                            ? "Submitting..."
                            : "Submit Review"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 py-2">
                      You've already submitted a review for this photographer.
                    </p>
                  )}
                </div>

                {/* Reviews List */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Customer Reviews ({photographer.reviewCount || 0})
                  </h3>
                  {isLoadingReviews ? (
                    <div className="py-4 text-center">
                      <p className="text-gray-600">Loading reviews...</p>
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-white rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">
                              {review.users?.name || "Anonymous"}
                            </h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                          {review.createdAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 py-4">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotographerProfileModal;
