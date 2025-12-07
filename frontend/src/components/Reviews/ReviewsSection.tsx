import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getReviewsByItem,
  createReview,
  deleteReview,
  getItemRating,
} from '../../api/services/review.service';
import { Star, Trash } from 'phosphor-react';
import toast from 'react-hot-toast';

interface Props {
  doctorId: string;
  doctorName: string;
}

const ReviewsSection: React.FC<Props> = ({ doctorId, doctorName }) => {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
    loadRating();
  }, [doctorId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviewsByItem(doctorId);
      setReviews(data?.reviews || []);
    } catch (e) {
      console.error('Error loading reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadRating = async () => {
    try {
      const data = await getItemRating(doctorId);
      setAverageRating(data?.averageRating || 0);
    } catch (e) {
      console.error('Error loading rating:', e);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error('Please log in to leave a review');
      return;
    }
    if (!formData.comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      await createReview(
        {
          externalItemId: doctorId,
          externalItemType: 'doctor',
          externalItemName: doctorName,
          rating: formData.rating,
          comment: formData.comment,
        },
        token
      );
      toast.success('Review submitted!');
      setFormData({ rating: 5, comment: '' });
      setShowForm(false);
      await loadReviews();
      await loadRating();
    } catch (e) {
      console.error('Error submitting review:', e);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!token) return;
    try {
      await deleteReview(reviewId, token);
      toast.success('Review deleted');
      await loadReviews();
      await loadRating();
    } catch (e) {
      console.error('Error deleting review:', e);
      toast.error('Failed to delete review');
    }
  };

  const userReview = reviews.find((r) => r.userId === user?._id);

  return (
    <div className="mt-6 bg-white p-6 rounded-xl border border-stroke shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primaryText">Reviews</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                weight={star <= Math.round(averageRating) ? 'fill' : 'regular'}
                className={star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm text-secondaryText ml-2">
            {averageRating.toFixed(1)} ({reviews.length} reviews)
          </span>
        </div>
      </div>

      {/* Review Form */}
      {user && !userReview && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Leave a Review
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmitReview} className="mb-4 p-4 border border-gray-200 rounded-lg">
          <div className="mb-3">
            <label className="block text-sm font-medium text-primaryText mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    size={28}
                    weight={star <= formData.rating ? 'fill' : 'regular'}
                    className={
                      star <= formData.rating ? 'text-yellow-400 cursor-pointer' : 'text-gray-300 cursor-pointer'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-primaryText mb-2">
              Your Review
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your experience..."
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <p className="text-secondaryText text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-secondaryText text-sm">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          weight={star <= review.rating ? 'fill' : 'regular'}
                          className={
                            star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-secondaryText">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-primaryText">
                    {review.userId?.firstName || 'Anonymous'} {review.userId?.lastName || ''}
                  </p>
                </div>
                {user && user._id === review.userId?._id && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
              <p className="text-sm text-primaryText">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
