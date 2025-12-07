import React from "react";
import { Link } from "react-router-dom";

const ReviewCard: React.FC<{ review: any }> = ({ review }) => {
  const author = review.userId || review.user || { firstName: "Unknown", _id: "" };
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${author._id}`} className="font-medium text-primaryText">
              {author.firstName} {author.lastName}
            </Link>
            <div className="text-sm text-secondaryText">{new Date(review.createdAt).toLocaleString()}</div>
          </div>
          <div className="mt-2">
            <div className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
            <p className="text-sm text-secondaryText mt-2">{review.comment}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
