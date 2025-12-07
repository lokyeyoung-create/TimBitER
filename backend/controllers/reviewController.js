import Review from "../models/Review.js";
import User from "../models/users/User.js";

// Create a review
export const createReview = async (req, res) => {
  try {
    const { externalItemId, externalItemType, externalItemName, rating, comment } =
      req.body;
    const userId = req.user.id;

    // Validate input
    if (!externalItemId || !externalItemType || !externalItemName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      externalItemId,
      userId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this item",
      });
    }

    // Create new review
    const review = new Review({
      externalItemId,
      externalItemType,
      externalItemName,
      userId,
      rating,
      comment,
    });

    await review.save();

    // Populate user info
    await review.populate("userId", "firstName lastName profilePic");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
};

// Get reviews for an external item
export const getReviewsByItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const reviews = await Review.find({
      externalItemId: itemId,
    })
      .populate("userId", "firstName lastName profilePic _id")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// Get reviews by user
export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user reviews",
      error: error.message,
    });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns the review
    if (!review.userId.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    // Update fields
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      review.rating = rating;
    }

    if (comment) {
      review.comment = comment;
    }

    await review.save();
    await review.populate("userId", "firstName lastName profilePic");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if user owns the review
    if (!review.userId.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};

// Get average rating for an item
export const getItemRating = async (req, res) => {
  try {
    const { itemId } = req.params;

    const stats = await Review.aggregate([
      {
        $match: {
          externalItemId: itemId,
        },
      },
      {
        $group: {
          _id: "$externalItemId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        success: true,
        averageRating: 0,
        totalReviews: 0,
      });
    }

    res.status(200).json({
      success: true,
      averageRating: stats[0].averageRating,
      totalReviews: stats[0].totalReviews,
    });
  } catch (error) {
    console.error("Error fetching item rating:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching item rating",
      error: error.message,
    });
  }
};
