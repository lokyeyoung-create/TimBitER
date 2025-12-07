import React from "react";
import { useNavigate } from "react-router-dom";

const SearchResultCard: React.FC<{ result: any }> = ({ result }) => {
  const navigate = useNavigate();

  const id = result._id || result.id || result.set_id || "";
  const title =
    (result.openfda && (result.openfda.brand_name || result.openfda.generic_name)) ||
    result.term ||
    id;
  const description =
    (result.indications_and_usage && result.indications_and_usage[0]) ||
    (result.purpose && result.purpose[0]) ||
    "No description available";

  return (
    <div className="bg-white border rounded p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 3v18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-primaryText">{title}</h3>
          <p className="text-sm text-secondaryText line-clamp-2">{description}</p>
          <div className="mt-2 flex items-center gap-2">
            <button
              className="px-3 py-1 bg-primary text-white rounded text-sm"
              onClick={() => navigate(`/details/${encodeURIComponent(id)}`)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
