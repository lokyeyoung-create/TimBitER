// backend/routes/bookmark/bookmarksApi.js
import express from "express";
import ArticleBookmark from "../../models/bookmark/ArticleBookmark.js";
import { authenticate } from "../../middleware/authentication.js";

const router = express.Router();

// Get all bookmarks for current user
router.get("/", authenticate, async (req, res) => {
  try {
    const bookmarks = await ArticleBookmark.find({
      userId: req.user._id, // Changed from req.user.userId
    }).sort({
      createdAt: -1,
    });
    res.json({ bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

// Check if article is bookmarked
router.get("/check/:pmid", authenticate, async (req, res) => {
  try {
    const { pmid } = req.params;
    const bookmark = await ArticleBookmark.findOne({
      userId: req.user._id, // Changed
      pmid,
    });
    res.json({ isBookmarked: !!bookmark, bookmark });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    res.status(500).json({ error: "Failed to check bookmark" });
  }
});

// Create a new bookmark
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      pmid,
      title,
      authors,
      journal,
      pubDate,
      abstract,
      link,
      notes,
      tags,
    } = req.body;

    const existingBookmark = await ArticleBookmark.findOne({
      userId: req.user._id, // Changed
      pmid,
    });

    if (existingBookmark) {
      return res.status(400).json({ error: "Article already bookmarked" });
    }

    const bookmark = new ArticleBookmark({
      userId: req.user._id, // Changed
      userType: req.user.role, // This should work as-is
      pmid,
      title,
      authors,
      journal,
      pubDate,
      abstract,
      link,
      notes: notes || "",
      tags: tags || [],
    });

    await bookmark.save();
    res.status(201).json({ bookmark });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    res.status(500).json({ error: "Failed to create bookmark" });
  }
});

// Update bookmark notes/tags
router.put("/:bookmarkId", authenticate, async (req, res) => {
  try {
    const { bookmarkId } = req.params;
    const { notes, tags } = req.body;

    const bookmark = await ArticleBookmark.findOne({
      _id: bookmarkId,
      userId: req.user._id, // Changed
    });

    if (!bookmark) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    if (notes !== undefined) bookmark.notes = notes;
    if (tags !== undefined) bookmark.tags = tags;

    await bookmark.save();
    res.json({ bookmark });
  } catch (error) {
    console.error("Error updating bookmark:", error);
    res.status(500).json({ error: "Failed to update bookmark" });
  }
});

// Delete a bookmark
router.delete("/:bookmarkId", authenticate, async (req, res) => {
  try {
    const { bookmarkId } = req.params;

    const result = await ArticleBookmark.findOneAndDelete({
      _id: bookmarkId,
      userId: req.user._id, // Changed
    });

    if (!result) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    res.json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({ error: "Failed to delete bookmark" });
  }
});

export default router;
