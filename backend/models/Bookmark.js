import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema(
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
    externalItemImage: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate bookmarks from same user
BookmarkSchema.index({ externalItemId: 1, userId: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", BookmarkSchema);

export default Bookmark;
