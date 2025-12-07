import Follow from "../models/Follow.js";

// Follow a user
export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    // Check if trying to follow self
    if (followerId === userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot follow yourself",
      });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      followerId,
      followingId: userId,
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: "Already following this user",
      });
    }

    // Create follow relationship
    const follow = new Follow({
      followerId,
      followingId: userId,
    });

    await follow.save();

    res.status(201).json({
      success: true,
      message: "User followed successfully",
      follow,
    });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({
      success: false,
      message: "Error following user",
      error: error.message,
    });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    const follow = await Follow.findOneAndDelete({
      followerId,
      followingId: userId,
    });

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: "Not following this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({
      success: false,
      message: "Error unfollowing user",
      error: error.message,
    });
  }
};

// Get followers of a user
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await Follow.find({
      followingId: userId,
    })
      .populate("followerId", "firstName lastName profilePic role _id")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      followers: followers.map((f) => f.followerId),
      count: followers.length,
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching followers",
      error: error.message,
    });
  }
};

// Get users that a user follows
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await Follow.find({
      followerId: userId,
    })
      .populate("followingId", "firstName lastName profilePic role _id")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      following: following.map((f) => f.followingId),
      count: following.length,
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching following",
      error: error.message,
    });
  }
};

// Check if current user follows another user
export const checkFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    const follow = await Follow.findOne({
      followerId,
      followingId: userId,
    });

    res.status(200).json({
      success: true,
      isFollowing: !!follow,
    });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({
      success: false,
      message: "Error checking follow status",
      error: error.message,
    });
  }
};

// Get follow stats for a user
export const getFollowStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const [followerCount, followingCount] = await Promise.all([
      Follow.countDocuments({ followingId: userId }),
      Follow.countDocuments({ followerId: userId }),
    ]);

    res.status(200).json({
      success: true,
      followers: followerCount,
      following: followingCount,
    });
  } catch (error) {
    console.error("Error fetching follow stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching follow stats",
      error: error.message,
    });
  }
};
