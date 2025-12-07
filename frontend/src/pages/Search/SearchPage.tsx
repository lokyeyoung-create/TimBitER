import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchDrugs } from "../../api/externalApi";
import SearchResults from "./SearchResults";

const STORAGE_KEY_PREFIX = "search:";

const SearchPage: React.FC = () => {
  const [queryParam] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = queryParam.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If URL contains q, perform search
    const q = initialQuery;
    if (q) {
      const cached = localStorage.getItem(STORAGE_KEY_PREFIX + q);
      if (cached) {
        setResults(JSON.parse(cached));
      } else {
        doSearch(q);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const doSearch = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchDrugs(q, 12);
      setResults(res.results || []);
      try {
        localStorage.setItem(STORAGE_KEY_PREFIX + q, JSON.stringify(res.results || []));
      } catch (e) {
        // ignore quota errors
      }
    } catch (err: any) {
      setError(err.message || "Error searching");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Push query into URL so it's shareable
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    // perform search
    doSearch(query.trim());
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Search Medical Data</h1>
      <form onSubmit={onSubmit} className="mb-6 flex gap-2">
        <input
          className="flex-1 p-3 border rounded"
          placeholder="Search medications, e.g., aspirin"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="px-4 py-2 bg-primary text-white rounded">Search</button>
      </form>

      {loading && <div className="text-center">Searching...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <SearchResults results={results} />
    </div>
  );
};

export default SearchPage;
