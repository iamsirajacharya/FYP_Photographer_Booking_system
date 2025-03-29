import React, { useState } from "react";
import { Star, Search, MessageSquare, ThumbsUp, Flag, X } from "lucide-react";
import DashboardLayout from "../DashboardLayout";

export default function PhotographerReviewsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReview, setReportReview] = useState(null);
  const [reportReason, setReportReason] = useState("");

  // Mock reviews data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      clientName: "Emily Davis",
      clientImage: "/placeholder.svg?height=100&width=100",
      date: "2023-10-15",
      rating: 5,
      comment:
        "Alex was amazing! Very professional and made me feel comfortable during the shoot. The photos turned out better than I expected. Would definitely book again for future sessions.",
      bookingType: "Portrait Session",
      replied: false,
      reply: "",
    },
    {
      id: 2,
      clientName: "John Smith",
      clientImage: "/placeholder.svg?height=100&width=100",
      date: "2023-10-10",
      rating: 5,
      comment:
        "Incredible experience working with Alex. The photos captured exactly what I was looking for. Highly recommend!",
      bookingType: "Wedding Photography",
      replied: true,
      reply:
        "Thank you so much, John! It was a pleasure capturing your special day. Looking forward to working with you again!",
    },
    {
      id: 3,
      clientName: "Lisa Johnson",
      clientImage: "/placeholder.svg?height=100&width=100",
      date: "2023-10-05",
      rating: 4,
      comment:
        "Great photographer with an eye for detail. Very pleased with the results.",
      bookingType: "Family Portrait",
      replied: false,
      reply: "",
    },
    {
      id: 4,
      clientName: "Michael Brown",
      clientImage: "/placeholder.svg?height=100&width=100",
      date: "2023-09-28",
      rating: 3,
      comment:
        "The photos were good, but I wish we had more variety in the poses and settings. Communication was excellent though.",
      bookingType: "Engagement Photos",
      replied: false,
      reply: "",
    },
    {
      id: 5,
      clientName: "Sarah Wilson",
      clientImage: "/placeholder.svg?height=100&width=100",
      date: "2023-09-20",
      rating: 5,
      comment:
        "Alex is a true professional. From the initial consultation to the final delivery, everything was perfect. The photos exceeded my expectations!",
      bookingType: "Corporate Headshots",
      replied: true,
      reply:
        "Thank you for your kind words, Sarah! I'm so glad you're happy with your headshots.",
    },
  ]);

  // Filter reviews based on active tab and search term
  const filteredReviews = reviews.filter((review) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "replied" && review.replied) ||
      (activeTab === "unreplied" && !review.replied) ||
      (activeTab === "5star" && review.rating === 5) ||
      (activeTab === "4star" && review.rating === 4) ||
      (activeTab === "3star" && review.rating === 3) ||
      (activeTab === "2star" && review.rating === 2) ||
      (activeTab === "1star" && review.rating === 1);

    const matchesSearch =
      review.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.bookingType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleReplySubmit = (reviewId) => {
    if (!replyText.trim()) return;

    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? { ...review, replied: true, reply: replyText }
          : review
      )
    );
    setReplyingTo(null);
    setReplyText("");
  };

  const handleReportSubmit = () => {
    if (!reportReason.trim() || !reportReview) return;

    alert(`Review reported. Reason: ${reportReason}`);
    setShowReportModal(false);
    setReportReview(null);
    setReportReason("");
  };

  // Calculate average rating
  const averageRating =
    reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length || 0;

  // Count reviews by rating
  const ratingCounts = reviews.reduce(
    (counts, review) => {
      counts[review.rating] += 1;
      return counts;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-purple-800">My Reviews</h1>
          <p className="text-muted-foreground">
            Manage and respond to client feedback
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search reviews..."
              className="pl-9 w-[250px] rounded border border-gray-300 px-3 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Review Summary & List */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="border rounded-lg shadow-sm p-4 md:col-span-1">
          <h2 className="text-lg font-bold">Review Summary</h2>
          <p className="text-muted-foreground">
            Your overall rating and statistics
          </p>
          <div className="flex flex-col items-center mt-4">
            <div className="flex items-center mb-2">
              <span className="text-3xl font-bold mr-2">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Based on {reviews.length} reviews
            </p>
            <div className="w-full space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-12">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width: `${
                          (ratingCounts[rating] / reviews.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {ratingCounts[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="border rounded-lg shadow-sm p-4 md:col-span-2">
          <h2 className="text-lg font-bold">Client Reviews</h2>
          <p className="text-muted-foreground">
            What your clients are saying about you
          </p>
          {/* Tabs */}
          <div className="mt-4">
            <div className="grid w-full grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded ${
                  activeTab === "all"
                    ? "bg-gray-300"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                All Reviews
              </button>
              <button
                onClick={() => setActiveTab("unreplied")}
                className={`px-4 py-2 rounded ${
                  activeTab === "unreplied"
                    ? "bg-gray-300"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Needs Reply
              </button>
              <button
                onClick={() => setActiveTab("replied")}
                className={`px-4 py-2 rounded ${
                  activeTab === "replied"
                    ? "bg-gray-300"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Replied
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <div key={review.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {/* Simple Avatar */}
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img
                            src={review.clientImage}
                            alt={review.clientName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{review.clientName}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {Array(5)
                                .fill(null)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200"
                                    }`}
                                  />
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {review.date} • {review.bookingType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setReportReview(review);
                          setShowReportModal(true);
                        }}
                        className="h-8 w-8 text-gray-500 hover:text-gray-700"
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {review.comment}
                    </p>

                    {review.replied && (
                      <div className="mt-4 rounded-md bg-gray-50 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">
                            Your Reply
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.reply}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-between">
                      <button className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        Helpful
                      </button>
                      {!review.replied && (
                        <button
                          onClick={() => {
                            setReplyingTo(review.id);
                            setReplyText("");
                          }}
                          className="border rounded px-2 py-1 text-sm text-purple-600"
                        >
                          <MessageSquare className="mr-1 h-4 w-4" />
                          Reply
                        </button>
                      )}
                    </div>

                    {replyingTo === review.id && (
                      <div className="mt-4">
                        <textarea
                          placeholder="Write your reply..."
                          className="min-h-[100px] mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="border rounded px-4 py-2 text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplySubmit(review.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
                            disabled={!replyText.trim()}
                          >
                            Submit Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
                  <Star className="h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">No reviews found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : activeTab === "unreplied"
                      ? "You've replied to all reviews!"
                      : "No reviews match the selected filter"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Review Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Report Review</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-sm text-muted-foreground">
                  {reportReview?.comment}
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="report-reason" className="text-sm font-medium">
                  Reason for reporting
                </label>
                <select
                  id="report-reason"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="spam">Spam or misleading</option>
                  <option value="not-client">Not a real client</option>
                  <option value="other">Other reason</option>
                </select>
              </div>
              {reportReason === "other" && (
                <div className="space-y-2">
                  <label
                    htmlFor="report-details"
                    className="text-sm font-medium"
                  >
                    Additional details
                  </label>
                  <textarea
                    id="report-details"
                    placeholder="Please provide more information..."
                    className="min-h-[100px] w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  ></textarea>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="border rounded px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  disabled={!reportReason}
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
