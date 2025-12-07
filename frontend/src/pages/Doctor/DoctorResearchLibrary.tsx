// frontend/src/pages/Doctor/DoctorResearchLibrary.tsx
import React, { useState, useEffect } from "react";
import { useRequireRole } from "../../hooks/useRequireRole";
import {
  pubmedService,
  PubMedArticle,
} from "../../api/services/pubmed.service";
import {
  bookmarkService,
  Bookmark,
} from "../../api/services/bookmarkapi.service";
import toast from "react-hot-toast";

const DoctorResearchLibrary: React.FC = () => {
  useRequireRole("Doctor");

  const [activeTab, setActiveTab] = useState<"search" | "bookmarks">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PubMedArticle[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [maxResults, setMaxResults] = useState(20);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoadingBookmarks(true);
      const { bookmarks: data } = await bookmarkService.getAll();
      setBookmarks(data);

      // Update bookmarked IDs
      const ids = new Set(data.map((b) => b.pmid));
      setBookmarkedIds(ids);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const response = await pubmedService.search(searchQuery, maxResults);
      setSearchResults(response.articles);

      if (response.articles.length === 0) {
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search PubMed");
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
      toast.success("Article bookmarked");

      // Reload bookmarks
      loadBookmarks();
    } catch (error: any) {
      console.error("Bookmark error:", error);
      toast.error(error?.response?.data?.error || "Failed to bookmark");
    }
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    if (!window.confirm("Remove this bookmark?")) return;

    try {
      await bookmarkService.delete(bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId));
      toast.success("Bookmark removed");

      // Reload to update bookmarked IDs
      loadBookmarks();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  const handleSaveNotes = async (bookmarkId: string) => {
    try {
      const { bookmark } = await bookmarkService.update(bookmarkId, noteText);
      setBookmarks((prev) =>
        prev.map((b) => (b._id === bookmarkId ? bookmark : b))
      );
      setEditingNotes(null);
      setNoteText("");
      toast.success("Notes saved");
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes");
    }
  };

  const startEditingNotes = (bookmark: Bookmark) => {
    setEditingNotes(bookmark._id);
    setNoteText(bookmark.notes);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary to-[#6886AC] text-white py-12 px-12">
        <div className="text-left">
          <h2 className="text-3xl font-semibold">Research Library</h2>
          <p className="text-lg mt-2 opacity-90">
            Search medical literature and manage your research bookmarks
          </p>
        </div>
      </div>

      <div className="mx-12 py-8">
        {/* Tabs */}
        <div className="flex border-b border-stroke mb-8">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "search"
                ? "text-primary border-b-2 border-primary"
                : "text-secondaryText hover:text-primaryText"
            }`}
          >
            Search PubMed
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "bookmarks"
                ? "text-primary border-b-2 border-primary"
                : "text-secondaryText hover:text-primaryText"
            }`}
          >
            My Bookmarks ({bookmarks.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === "search" ? (
          <div>
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search: diabetes treatment, breast cancer prevention..."
                  className="flex-1 px-4 py-3 border border-stroke rounded-lg focus:outline-none focus:border-primary"
                />
                <select
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="px-4 py-3 border border-stroke rounded-lg focus:outline-none focus:border-primary bg-white"
                >
                  <option value={10}>10 results</option>
                  <option value={20}>20 results</option>
                  <option value={50}>50 results</option>
                </select>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-[#4A6B92] disabled:opacity-50 font-medium transition-colors"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-secondaryText font-medium">
                  {searchResults.length} articles found
                </p>
                {searchResults.map((article) => (
                  <div
                    key={article.pmid}
                    className="p-6 bg-foreground border border-stroke rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-primaryText mb-3 text-lg">
                          {article.title}
                        </h3>
                        <div className="space-y-1 mb-3">
                          <p className="text-sm text-secondaryText">
                            <span className="font-medium">Authors:</span>{" "}
                            {article.authors.slice(0, 4).join(", ")}
                            {article.authors.length > 4 ? ", et al." : ""}
                          </p>
                          <p className="text-sm text-secondaryText">
                            <span className="font-medium">Journal:</span>{" "}
                            {article.journal}
                          </p>
                          <p className="text-sm text-secondaryText">
                            <span className="font-medium">Published:</span>{" "}
                            {article.pubDate}
                          </p>
                          <p className="text-xs text-secondaryText">
                            PMID: {article.pmid}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm text-primary hover:text-[#4A6B92] border border-primary rounded text-center transition-colors"
                        >
                          View Article
                        </a>
                        <button
                          onClick={() => handleBookmark(article)}
                          disabled={bookmarkedIds.has(article.pmid)}
                          className={`px-4 py-2 text-sm rounded transition-colors ${
                            bookmarkedIds.has(article.pmid)
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-primary text-white hover:bg-[#4A6B92]"
                          }`}
                        >
                          {bookmarkedIds.has(article.pmid) ? "✓ Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSearching && searchResults.length === 0 && searchQuery && (
              <div className="text-center py-12 text-secondaryText">
                <p>No results found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try different search terms</p>
              </div>
            )}

            {!searchQuery && searchResults.length === 0 && (
              <div className="text-center py-12 text-secondaryText">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-primaryText mb-2">
                  Search Medical Literature
                </h3>
                <p>Enter keywords to search PubMed's database</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {loadingBookmarks ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-lg font-medium text-primaryText mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-secondaryText mb-4">
                  Search for articles and save them to your library
                </p>
                <button
                  onClick={() => setActiveTab("search")}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#4A6B92] transition-colors"
                >
                  Start Searching
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark._id}
                    className="bg-foreground border border-stroke rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-lg font-semibold text-primaryText flex-1 pr-4">
                        {bookmark.title}
                      </h2>
                      <div className="flex gap-2">
                        <a
                          href={bookmark.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm text-primary hover:text-[#4A6B92] border border-primary rounded transition-colors"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDeleteBookmark(bookmark._id)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-600 rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <p className="text-sm text-secondaryText">
                        <span className="font-medium">Authors:</span>{" "}
                        {bookmark.authors.slice(0, 5).join(", ")}
                        {bookmark.authors.length > 5 ? ", et al." : ""}
                      </p>
                      <p className="text-sm text-secondaryText">
                        <span className="font-medium">Journal:</span>{" "}
                        {bookmark.journal}
                      </p>
                      <p className="text-sm text-secondaryText">
                        <span className="font-medium">Published:</span>{" "}
                        {bookmark.pubDate}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-stroke">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-primaryText">
                          Professional Notes
                        </label>
                        {editingNotes !== bookmark._id && (
                          <button
                            onClick={() => startEditingNotes(bookmark)}
                            className="text-sm text-primary hover:text-[#4A6B92] transition-colors"
                          >
                            {bookmark.notes ? "Edit" : "Add Notes"}
                          </button>
                        )}
                      </div>

                      {editingNotes === bookmark._id ? (
                        <div>
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:border-primary"
                            rows={4}
                            placeholder="Add clinical notes, treatment insights, or relevance to your practice..."
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => {
                                setEditingNotes(null);
                                setNoteText("");
                              }}
                              className="px-4 py-2 text-sm text-secondaryText hover:text-primaryText transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNotes(bookmark._id)}
                              className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-[#4A6B92] transition-colors"
                            >
                              Save Notes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-secondaryText italic">
                          {bookmark.notes || "No notes yet"}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-secondaryText mt-4">
                      Saved {formatDate(bookmark.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorResearchLibrary;
