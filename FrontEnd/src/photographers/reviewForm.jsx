import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star } from "lucide-react";
import { useCreateReviewMutation } from "../redux/api/reviewApi";
import {
  setReviewRating,
  setReviewComment,
  closeReviewForm,
} from "../redux/api/reviewApi";

const ReviewForm = ({ photographerId, onClose }) => {
  const dispatch = useDispatch();
  const { reviewDraft } = useSelector((state) => state.reviews);
  const { rating, comment } = reviewDraft;
  const [hoverRating, setHoverRating] = useState(0);
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      await createReview({
        photographerId,
        rating,
        comment,
      }).unwrap();

      dispatch(closeReviewForm());
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleCancel = () => {
    dispatch(closeReviewForm());
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Rate Your Experience</h3>

      {/* Star Rating */}
      <div className="flex items-center mb-4">
        <p className="mr-4 font-medium">Rating:</p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => dispatch(setReviewRating(star))}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  (hoverRating || rating) >= star
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
        <label htmlFor="comment" className="block mb-2 font-medium">
          Your Review (Optional)
        </label>
        <textarea
          id="comment"
          rows="4"
          value={comment}
          onChange={(e) => dispatch(setReviewComment(e.target.value))}
          placeholder="Share your experience with this photographer..."
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || rating === 0}
          className={`px-4 py-2 rounded-md text-white ${
            isLoading || rating === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
