import React from "react";
import SearchResultCard from "./SearchResultCard";

const SearchResults: React.FC<{ results: any[] }> = ({ results }) => {
  if (!results || results.length === 0) {
    return <div className="text-center text-secondaryText">No results found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((r, idx) => (
        <SearchResultCard key={r._id || r.id || idx} result={r} />
      ))}
    </div>
  );
};

export default SearchResults;
