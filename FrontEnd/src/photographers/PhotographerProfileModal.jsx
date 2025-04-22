import { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  DollarSign,
  Calendar,
  X,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetPhotographerDetailsQuery } from "../redux/api/photographerApi";
import {
  useGetPhotographerReviewsQuery,
  useCreateReviewMutation,
} from "../redux/api/reviewApi";
import { useCreateBookingMutation } from "../redux/api/bookingApi";
import { format, parseISO, differenceInMinutes } from "date-fns";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Helper function to build full URL for images stored in the /uploads folder
const getImageUrl = (
  filename,
  placeholder = "/placeholder-photographer.jpg"
) => {
  if (!filename) return placeholder;

  // If filename already starts with /uploads/, don't add it again
  const baseUrl = "http://localhost:3000";
  const path = filename.startsWith("/uploads/")
    ? filename
    : `/uploads/${filename}`;
  return `${baseUrl}${path}`;
};

const PhotographerProfileModal = ({
  photographerId,
  isOpen,
  onClose,
  userBookings = [],
  userId,
}) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

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
  const [activeTab, setActiveTab] = useState("booking");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (photographer) {
      console.log("Photographer details:", photographer);
    }
  }, [photographer]);

  // Reset image index when portfolio images change
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsImageLoading(true);
  }, [photographer?.portfolioImages]);

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

  // const availableDates =
  //   photographer.availability && typeof photographer.availability === "object"
  //     ? Object.entries(photographer.availability)
  //         .filter(([_, dayInfo]) => dayInfo.available)
  //         .map(([date]) => date)
  //     : [];

  // const portfolioImages = photographer.portfolioImages || [];
  // const hasPortfolioImages = portfolioImages.length > 0;
  // const displayImages = hasPortfolioImages
  //   ? portfolioImages
  //   : [photographer.users?.profileImage || "/placeholder-photographer.jpg"];
  let portfolioImages = [];
  if (photographer.portfolioImages) {
    if (Array.isArray(photographer.portfolioImages)) {
      portfolioImages = photographer.portfolioImages;
    } else {
      try {
        portfolioImages = JSON.parse(photographer.portfolioImages);
      } catch (err) {
        console.error("Failed to parse portfolioImages:", err);
        portfolioImages = [];
      }
    }
  }

  // 2) Build displayImages from that array (falling back on the profileImage)
  const hasPortfolioImages = portfolioImages.length > 0;
  const displayImages = hasPortfolioImages
    ? portfolioImages
    : [photographer.users?.profileImage || "/placeholder-photographer.jpg"];

  let availableDaysMap = {};
  if (photographer.availableDays) {
    try {
      availableDaysMap = JSON.parse(photographer.availableDays);
    } catch (err) {
      console.error("Failed to parse availableDays:", err);
    }
  }

  // 2) Generate the next N days (e.g. 14 days)
  const today = new Date();
  const upcomingDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  // 3) Filter by your map (e.g. monday, tuesday, …)
  const availableDates = upcomingDates
    .filter((d) => {
      const weekday = d
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      return availableDaysMap[weekday];
    })
    .map((d) => d.toISOString().slice(0, 10)); // "YYYY-MM-DD"

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
    setIsImageLoading(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
    setIsImageLoading(true);
  };

  const handleBooking = async () => {
    if (!selectedDate || !startTime || !endTime) {
      alert("Please select a date, start time, and end time");
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

    setIsProcessingPayment(true);

    try {
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
        paymentMethod,
      };

      // Create booking
      const newBooking = await createBooking(bookingData).unwrap();

      if (paymentMethod === "online") {
        // Initiate eSewa payment
        const response = await fetch(
          "http://localhost:3000/api/bookings/esewa/initiate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              bookingId: newBooking.booking.id,
              amount: totalPrice,
            }),
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to initiate payment: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("eSewa initiation response:", data);

        if (data.html) {
          // Render and submit eSewa form
          const formContainer = document.createElement("div");
          formContainer.innerHTML = data.html;
          document.body.appendChild(formContainer);

          // Manually submit the form to ensure redirect happens
          const form = document.getElementById("esewa_payment_form");
          if (form) {
            console.log("Submitting eSewa form...");
            form.submit();
          } else {
            throw new Error("eSewa payment form not found in the DOM");
          }
        } else if (data.url) {
          console.log("Redirecting to eSewa URL:", data.url);
          window.location.href = data.url;
        } else {
          throw new Error(
            data.error || data.message || "Failed to initiate eSewa payment"
          );
        }
      } else {
        alert("Booking created with Cash payment.");
        onClose();
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert(`Booking failed: ${error.message}`);
      setIsProcessingPayment(false);
    }
  };

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

      setRating(0);
      setComment("");
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

  const handleStartConversation = () => {
    const photographerUserId = photographer.users?.id;
    if (photographerUserId) {
      const initialConversation = {
        id: photographerUserId,
        name: photographer.users?.name || "Photographer",
        profileImage: photographer.users?.profileImage,
      };
      localStorage.setItem(
        "activeConversation",
        JSON.stringify(initialConversation)
      );

      if (!localStorage.getItem(`messages_${photographerUserId}`)) {
        localStorage.setItem(
          `messages_${photographerUserId}`,
          JSON.stringify([])
        );
      }

      const clientInfo = {
        id: userId,
        name: "Client",
        image: "/placeholder.svg?height=64&width=64",
      };
      localStorage.setItem(
        "photographer_active_conversation",
        JSON.stringify(clientInfo)
      );

      if (!localStorage.getItem(`photographer_messages_${userId}`)) {
        localStorage.setItem(
          `photographer_messages_${userId}`,
          JSON.stringify([])
        );
      }

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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-60"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div>
            {/* Carousel Slider */}
            <div className="relative mb-6">
              {/* Image and Loading Spinner */}
              <div className="relative w-full h-96">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                    <svg
                      className="animate-spin h-8 w-8 text-purple-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
                <img
                  src={getImageUrl(displayImages[currentImageIndex])}
                  alt={
                    hasPortfolioImages
                      ? `Portfolio image ${currentImageIndex + 1}`
                      : photographer.users?.name || "Photographer"
                  }
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) =>
                    (e.target.src = "/placeholder-photographer.jpg")
                  }
                  onLoad={() => setIsImageLoading(false)}
                  loading="lazy"
                />
              </div>

              {/* Navigation Buttons */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Dots Indicators */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {displayImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setIsImageLoading(true);
                      }}
                      className={`h-3 w-3 rounded-full ${
                        index === currentImageIndex
                          ? "bg-purple-600"
                          : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

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
              <div className="mt-4">
                <button
                  onClick={handleStartConversation}
                  className="flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Conversation
                </button>
              </div>
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
                    disabled={isProcessingPayment}
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
                          disabled={isProcessingPayment}
                        />
                      </div>
                      <div>
                        <label className="block mb-1">End Time</label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={isProcessingPayment}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  disabled={isProcessingPayment}
                />

                <button
                  onClick={handleBooking}
                  disabled={
                    !selectedDate ||
                    !startTime ||
                    !endTime ||
                    isProcessingPayment
                  }
                  className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                    !selectedDate ||
                    !startTime ||
                    !endTime ||
                    isProcessingPayment
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                  }`}
                >
                  {isProcessingPayment ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Book Photographer"
                  )}
                </button>
              </div>
            ) : (
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
