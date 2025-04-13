import { Star, User } from "lucide-react";
import { format } from "date-fns";

const ReviewsList = ({ reviews, isLoading }) => {
  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {review.users?.profileImage ? (
                <img
                  src={review.users.profileImage || "/placeholder.svg"}
                  alt={review.users?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium">
                  {review.users?.name || "Anonymous"}
                </h4>
                <span className="text-sm text-gray-500">
                  {review.createdAt
                    ? format(new Date(review.createdAt), "MMM d, yyyy")
                    : ""}
                </span>
              </div>

              <div className="flex mb-2">
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

              {review.comment && (
                <p className="text-gray-700">{review.comment}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
