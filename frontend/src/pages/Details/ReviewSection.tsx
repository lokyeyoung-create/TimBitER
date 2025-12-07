import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import AddReviewForm from "./AddReviewForm";
import { useAuth } from "../../contexts/AuthContext";

const ReviewSection: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/item/${encodeURIComponent(itemId)}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchReviews(); }, [itemId]);

  const onAdded = (r:any) => {
    setReviews(prev=>[r, ...prev]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Reviews</h3>
      {token ? (
        <AddReviewForm itemId={itemId} onAdded={onAdded} />
      ) : (
        <div className="text-sm text-secondaryText">Login to add reviews</div>
      )}

      {loading ? <div>Loading reviews...</div> : (
        <div className="space-y-3">
          {reviews.map(r=> <ReviewCard key={r._id} review={r} />)}
          {reviews.length===0 && <div className="text-secondaryText">No reviews yet.</div>}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
