import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    externalItemId: {
      type: String,
      required: true,
      index: true,
    },
    externalItemType: {
      type: String,
      required: true,
      enum: ["drug", "disease", "article", "other", "user", "doctor"],
    },
    externalItemName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate reviews from same user
// Use field names rather than variables when creating indexes
ReviewSchema.index({ externalItemId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
