import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const AddReviewForm: React.FC<{ itemId: string; onAdded: (r:any)=>void }> = ({ itemId, onAdded }) => {
  const { token, user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Please login to add a review");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          externalItemId: itemId,
          externalItemType: "drug",
          externalItemName: itemId,
          rating,
          comment,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed");
      setComment("");
      onAdded(data.review);
    } catch (err:any) {
      setError(err.message || "Error");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label className="text-sm">Rating</label>
        <select value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="ml-2 p-1 border rounded">
          {[5,4,3,2,1].map(r=> <option key={r} value={r}>{r} star{r>1?"s":""}</option>)}
        </select>
      </div>
      <div>
        <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full p-2 border rounded" placeholder="Write your review..." />
      </div>
      <div>
        <button className="px-3 py-1 bg-primary text-white rounded" disabled={loading}>{loading?"Saving...":"Add Review"}</button>
      </div>
    </form>
  );
};

export default AddReviewForm;
