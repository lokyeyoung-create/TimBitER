import express from "express";
import {
  createReview,
  getReviewsByItem,
  getReviewsByUser,
  updateReview,
  deleteReview,
  getItemRating,
} from "../controllers/reviewController.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

// Create review (requires auth)
router.post("/", authenticate, createReview);

// Get reviews for an item (public)
router.get("/item/:itemId", getReviewsByItem);

// Get reviews by user (public)
router.get("/user/:userId", getReviewsByUser);

// Get rating stats for an item (public)
router.get("/item/:itemId/rating", getItemRating);

// Update review (requires auth, owns review)
router.put("/:reviewId", authenticate, updateReview);

// Delete review (requires auth, owns review)
router.delete("/:reviewId", authenticate, deleteReview);

export default router;
