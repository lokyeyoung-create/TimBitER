import express from "express";
import {
  createBookmark,
  getUserBookmarks,
  isBookmarked,
  deleteBookmark,
  deleteBookmarkByItem,
} from "../controllers/bookmarkController.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

// Create bookmark (requires auth)
router.post("/", authenticate, createBookmark);

// Get user's bookmarks (public)
router.get("/user/:userId", getUserBookmarks);

// Check if item is bookmarked by current user (requires auth)
router.get("/check/:itemId", authenticate, isBookmarked);

// Delete bookmark (requires auth, owns bookmark)
router.delete("/:bookmarkId", authenticate, deleteBookmark);

// Delete bookmark by item ID (requires auth)
router.delete("/item/:itemId", authenticate, deleteBookmarkByItem);

export default router;
