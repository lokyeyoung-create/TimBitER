// backend/models/ArticleBookmark.js
import mongoose from "mongoose";

const articleBookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userType: {
      type: String,
      enum: ["Patient", "Doctor"],
      required: true,
    },
    pmid: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    authors: [String],
    journal: String,
    pubDate: String,
    abstract: String,
    link: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

articleBookmarkSchema.index({ userId: 1, pmid: 1 }, { unique: true });

const ArticleBookmark = mongoose.model(
  "ArticleBookmark",
  articleBookmarkSchema
);

export default ArticleBookmark;
