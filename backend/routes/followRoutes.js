import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  getFollowStats,
} from "../controllers/followController.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

// Follow a user (requires auth)
router.post("/:userId", authenticate, followUser);

// Unfollow a user (requires auth)
router.delete("/:userId", authenticate, unfollowUser);

// Get followers of a user (public)
router.get("/followers/:userId", getFollowers);

// Get users that a user follows (public)
router.get("/following/:userId", getFollowing);

// Check follow status for current user (requires auth)
router.get("/check/:userId", authenticate, checkFollowStatus);

// Get follow stats for a user (public)
router.get("/stats/:userId", getFollowStats);

export default router;
