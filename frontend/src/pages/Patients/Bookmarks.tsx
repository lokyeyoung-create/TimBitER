// frontend/src/pages/Patients/PatientBookmarks.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  bookmarkService,
  Bookmark,
} from "../../api/services/bookmarkapi.service";
import { useRequireRole } from "../../hooks/useRequireRole";
import toast from "react-hot-toast";

const PatientBookmarks: React.FC = () => {
  useRequireRole("Patient");
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const { bookmarks: data } = await bookmarkService.getAll();
      setBookmarks(data);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookmarkId: string) => {
    if (!window.confirm("Are you sure you want to remove this bookmark?"))
      return;

    try {
      await bookmarkService.delete(bookmarkId);
      setBookmarks((prev) => prev.filter((b) => b._id !== bookmarkId));
      toast.success("Bookmark removed");
    } catch (error) {
      console.error("Error deleting bookmark:", error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/patientdashboard")}
            className="text-primary hover:text-[#4A6B92] flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="bg-foreground rounded-lg shadow-sm border border-stroke p-8">
          <h1 className="text-3xl font-semibold text-primaryText mb-2">
            My Research Library
          </h1>
          <p className="text-secondaryText mb-8">
            Medical articles and research papers you've saved
          </p>

          {bookmarks.length === 0 ? (
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
                Start searching for medical research on your dashboard
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#4A6B92]"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark._id}
                  className="border border-stroke rounded-lg p-6 hover:border-primary transition-colors"
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
                        className="px-3 py-1 text-sm text-primary hover:text-[#4A6B92] border border-primary rounded"
                      >
                        View Article
                      </a>
                      <button
                        onClick={() => handleDelete(bookmark._id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-600 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
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
                    <p className="text-sm text-secondaryText">
                      <span className="font-medium">PubMed ID:</span>{" "}
                      {bookmark.pmid}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-stroke">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-primaryText">
                        My Notes
                      </label>
                      {editingNotes !== bookmark._id && (
                        <button
                          onClick={() => startEditingNotes(bookmark)}
                          className="text-sm text-primary hover:text-[#4A6B92]"
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
                          placeholder="Add your personal notes about this article..."
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => {
                              setEditingNotes(null);
                              setNoteText("");
                            }}
                            className="px-4 py-2 text-sm text-secondaryText hover:text-primaryText"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(bookmark._id)}
                            className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-[#4A6B92]"
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
                    Saved on {new Date(bookmark.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientBookmarks;
