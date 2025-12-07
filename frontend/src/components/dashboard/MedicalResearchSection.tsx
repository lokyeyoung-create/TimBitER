// frontend/src/components/dashboard/MedicalResearchSection.tsx
import React, { useState } from "react";
import {
  pubmedService,
  PubMedArticle,
} from "../../api/services/pubmed.service";
import { bookmarkService } from "../../api/services/bookmarkapi.service";
import toast from "react-hot-toast";

interface MedicalResearchSectionProps {
  onViewAllBookmarks: () => void;
}

const MedicalResearchSection: React.FC<MedicalResearchSectionProps> = ({
  onViewAllBookmarks,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<PubMedArticle[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const response = await pubmedService.search(searchQuery, 10);
      setResults(response.articles);
      setShowResults(true);

      // Check which articles are already bookmarked
      const bookmarkedSet = new Set<string>();
      for (const article of response.articles) {
        try {
          const { isBookmarked } = await bookmarkService.checkBookmarked(
            article.pmid
          );
          if (isBookmarked) {
            bookmarkedSet.add(article.pmid);
          }
        } catch (err) {
          console.error("Error checking bookmark:", err);
        }
      }
      setBookmarkedIds(bookmarkedSet);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search medical literature");
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookmark = async (article: PubMedArticle) => {
    try {
      if (bookmarkedIds.has(article.pmid)) {
        toast.error("Article already bookmarked");
        return;
      }

      await bookmarkService.create(article);
      setBookmarkedIds((prev) => new Set([...prev, article.pmid]));
      toast.success("Article bookmarked successfully");
    } catch (error: any) {
      console.error("Bookmark error:", error);
      toast.error(error?.response?.data?.error || "Failed to bookmark article");
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-foreground border border-stroke rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-primaryText">
            Medical Research
          </h2>
          <p className="text-sm text-secondaryText mt-1">
            Search PubMed for medical literature and research papers
          </p>
        </div>
        <button
          onClick={onViewAllBookmarks}
          className="text-sm text-primary hover:text-[#4A6B92] font-medium"
        >
          View My Bookmarks →
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medical topics, conditions, treatments..."
            className="flex-1 px-4 py-2 border border-stroke rounded-lg focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#4A6B92] disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {showResults && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <p className="text-center text-secondaryText py-4">
              No results found. Try a different search term.
            </p>
          ) : (
            <>
              <p className="text-sm text-secondaryText">
                Found {results.length} articles
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.map((article) => (
                  <div
                    key={article.pmid}
                    className="p-4 border border-stroke rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-primaryText mb-2">
                          {truncateText(article.title, 120)}
                        </h3>
                        <p className="text-sm text-secondaryText mb-2">
                          {article.authors.slice(0, 3).join(", ")}
                          {article.authors.length > 3 ? ", et al." : ""}
                        </p>
                        <p className="text-xs text-secondaryText">
                          {article.journal} • {article.pubDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm text-primary hover:text-[#4A6B92] border border-primary rounded"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleBookmark(article)}
                          disabled={bookmarkedIds.has(article.pmid)}
                          className={`px-3 py-1 text-sm rounded ${
                            bookmarkedIds.has(article.pmid)
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-primary text-white hover:bg-[#4A6B92]"
                          }`}
                        >
                          {bookmarkedIds.has(article.pmid) ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalResearchSection;
