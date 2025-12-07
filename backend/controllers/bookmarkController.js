import Bookmark from "../models/Bookmark.js";
import Doctor from "../models/doctors/Doctor.js";

// Create a bookmark
export const createBookmark = async (req, res) => {
  try {
    const { externalItemId, externalItemType, externalItemName, externalItemImage } =
      req.body;
    const userId = req.user.id;

    // Validate input
    if (!externalItemId || !externalItemType || !externalItemName) {
      return res.status(400).json({
        success: false,
        message: "Item ID, type, and name are required",
      });
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      externalItemId,
      userId,
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: "You have already bookmarked this item",
      });
    }

    // Create new bookmark
    const bookmark = new Bookmark({
      externalItemId,
      externalItemType,
      externalItemName,
      externalItemImage,
      userId,
    });

    await bookmark.save();

    res.status(201).json({
      success: true,
      message: "Bookmark created successfully",
      bookmark,
    });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    res.status(500).json({
      success: false,
      message: "Error creating bookmark",
      error: error.message,
    });
  }
};

// Get user's bookmarks
export const getUserBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 });

    // If there are bookmarked doctors or bookmarked users (doctors may be bookmarked by user id),
    // fetch their full doctor records. We support bookmarks where `externalItemId` is either a
    // Doctor._id or a User._id (doctor.user).
    const doctorOrUserBookmarks = bookmarks.filter(
      (b) => b.externalItemType === "doctor" || b.externalItemType === "user"
    );

    if (doctorOrUserBookmarks.length > 0) {
      const ids = doctorOrUserBookmarks.map((b) => b.externalItemId);

      // Find doctors where either the doctor _id or the referenced user is in the ids list
      const doctors = await Doctor.find({
        $or: [{ _id: { $in: ids } }, { user: { $in: ids } }],
      }).populate("user", "firstName lastName profilePic role");

      const doctorMapByDoctorId = {};
      const doctorMapByUserId = {};
      doctors.forEach((d) => {
        doctorMapByDoctorId[d._id.toString()] = d;
        if (d.user && d.user._id) doctorMapByUserId[d.user._id.toString()] = d;
      });

      // Attach doctor details to corresponding bookmarks
      const bookmarksWithDetails = bookmarks.map((b) => {
        const obj = b.toObject ? b.toObject() : b;
        if (b.externalItemType === "doctor" || b.externalItemType === "user") {
          obj.doctor = doctorMapByDoctorId[b.externalItemId] || doctorMapByUserId[b.externalItemId] || null;
        }
        return obj;
      });

      return res.status(200).json({ success: true, bookmarks: bookmarksWithDetails });
    }

    res.status(200).json({
      success: true,
      bookmarks,
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookmarks",
      error: error.message,
    });
  }
};

// Check if item is bookmarked by user
export const isBookmarked = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const bookmark = await Bookmark.findOne({
      externalItemId: itemId,
      userId,
    });

    res.status(200).json({
      success: true,
      isBookmarked: !!bookmark,
    });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    res.status(500).json({
      success: false,
      message: "Error checking bookmark status",
      error: error.message,
    });
  }
};

// Delete a bookmark
export const deleteBookmark = async (req, res) => {
  try {
    const { bookmarkId } = req.params;
    const userId = req.user.id;

    const bookmark = await Bookmark.findById(bookmarkId);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    // Check if user owns the bookmark
    if (!bookmark.userId.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this bookmark",
      });
    }

    await Bookmark.findByIdAndDelete(bookmarkId);

    res.status(200).json({
      success: true,
      message: "Bookmark deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting bookmark",
      error: error.message,
    });
  }
};

// Delete bookmark by external item ID (convenient endpoint)
export const deleteBookmarkByItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const result = await Bookmark.deleteOne({
      externalItemId: itemId,
      userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bookmark deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting bookmark",
      error: error.message,
    });
  }
};
