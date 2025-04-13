import { useState } from "react";
import { Star, MessageSquare, Search, ThumbsUp, Flag } from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import { useGetPhotographerReviewsQuery } from "../../redux/api/reviewApi";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

export default function PhotographerReviewsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  // Get the photographer ID from the authenticated user
  const user = useSelector((state) => state.auth.user);
  const photographerId = user?.photographerProfile?.id;

  // Fetch reviews for the photographer
  const { data, error, isLoading } = useGetPhotographerReviewsQuery(
    photographerId,
    {
      skip: !photographerId,
    }
  );

  // Extract reviews from the API response (default to empty array)
  const reviews = data?.reviews || [];

  // Compute statistics based on actual review data
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        ).toFixed(1)
      : 0;

  // Calculate distribution (ratings from 5 to 1)
  const distribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage =
      totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { rating, count, percentage };
  });

  // Filter reviews based on active tab and search term
  const filteredReviews = reviews.filter((review) => {
    // Determine if a review fits the active tab criteria based on presence of a reply or its rating
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "replied" && review.reply) ||
      (activeTab === "unreplied" && !review.reply) ||
      (activeTab === "positive" && review.rating >= 4) ||
      (activeTab === "negative" && review.rating <= 3);

    // Use client's name (if available) and comment for search matching
    const term = searchTerm.toLowerCase();
    const clientName = review.users?.name?.toLowerCase() || "";
    const comment = review.comment?.toLowerCase() || "";

    return matchesTab && (clientName.includes(term) || comment.includes(term));
  });

  // Placeholder for handling a reply submission (integration with a reply API can be added)
  const handleReplySubmit = (reviewId) => {
    alert(`Reply submitted for review #${reviewId}: ${replyText}`);
    setReplyingTo(null);
    setReplyText("");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">
          <p className="text-red-500 dark:text-red-400">
            Error loading reviews: {error.message || "Please try again later."}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Client Reviews
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Manage and respond to your client feedback
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <input
              placeholder="Search reviews..."
              className="pl-9 w-full sm:w-[220px] rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Rating Summary Card */}
        <div className="md:col-span-1">
          <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Rating Summary
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Overall client satisfaction
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {averageRating}
                  </div>
                  <div className="mt-1 flex">
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                          }`}
                        />
                      ))}
                  </div>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Based on {totalReviews} reviews
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {distribution.map((item) => (
                  <div key={item.rating} className="flex items-center">
                    <div className="w-8 text-sm text-gray-600 dark:text-gray-400">
                      {item.rating} <Star className="inline-block h-3 w-3" />
                    </div>
                    <div className="ml-2 flex-1">
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-purple-600 dark:bg-purple-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-2 w-9 text-right text-sm text-gray-600 dark:text-gray-400">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3 text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {reviews.filter((r) => r.reply).length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Replied
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3 text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {reviews.filter((r) => !r.reply).length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Awaiting Reply
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <ul className="flex flex-nowrap -mb-px text-sm font-medium text-center">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                    activeTab === "all"
                      ? "text-purple-600 dark:text-purple-500 border-purple-600 dark:border-purple-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                >
                  All Reviews
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("unreplied")}
                  className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                    activeTab === "unreplied"
                      ? "text-purple-600 dark:text-purple-500 border-purple-600 dark:border-purple-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                >
                  Awaiting Reply
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("replied")}
                  className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                    activeTab === "replied"
                      ? "text-purple-600 dark:text-purple-500 border-purple-600 dark:border-purple-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                >
                  Replied
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("positive")}
                  className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                    activeTab === "positive"
                      ? "text-purple-600 dark:text-purple-500 border-purple-600 dark:border-purple-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                >
                  Positive
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("negative")}
                  className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                    activeTab === "negative"
                      ? "text-purple-600 dark:text-purple-500 border-purple-600 dark:border-purple-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                >
                  Negative
                </button>
              </li>
            </ul>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="mr-4 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={`http://localhost:3000${review.users?.profileImage}`}
                          alt={review.users?.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {review.users?.name || "Anonymous"}
                          </h3>
                          {review.sessionType && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-900/50 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-300 mt-1 sm:mt-0">
                              {review.sessionType}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex">
                            {Array(5)
                              .fill(null)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                                  }`}
                                />
                              ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                            {dayjs(review.createdAt).format("YYYY-MM-DD")}
                          </p>
                        </div>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                          {review.comment}
                        </p>

                        {/* Review Actions */}
                        <div className="mt-4 flex items-center gap-4">
                          <button className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <ThumbsUp className="mr-1 h-3.5 w-3.5" />
                            Helpful
                          </button>
                          <button className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <Flag className="mr-1 h-3.5 w-3.5" />
                            Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reply Section */}
                  {review.reply ? (
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6">
                      <div className="flex">
                        <div className="mr-4 h-8 w-8 rounded-full overflow-hidden">
                          <img
                            src={`http://localhost:3000${review.users?.profileImage}`}
                            alt={review.users?.name || "User"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              Your Reply
                            </h4>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              {dayjs(review.reply.date).format("YYYY-MM-DD")}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {review.reply.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                      {replyingTo === review.id ? (
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              Write a Reply
                            </h4>
                            <button
                              onClick={() => setReplyingTo(null)}
                              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply here..."
                            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            rows={3}
                          ></textarea>
                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={() => handleReplySubmit(review.id)}
                              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              Send Reply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(review.id)}
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2"
                        >
                          <MessageSquare className="mr-1 h-3.5 w-3.5" />
                          Reply to Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
                <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3">
                  <Star className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No reviews found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {activeTab === "all"
                    ? "You don't have any reviews yet."
                    : `You don't have any ${activeTab} reviews.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
