import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate follows and enable unique constraint
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Prevent self-following with a custom validator
FollowSchema.pre("save", async function (next) {
  if (this.followerId.equals(this.followingId)) {
    const err = new Error("Cannot follow yourself");
    next(err);
  } else {
    next();
  }
});

const Follow = mongoose.model("Follow", FollowSchema);

export default Follow;
