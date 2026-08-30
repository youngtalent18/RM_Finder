import User from "../models/user.js";
import UserProfile from "../models/userProfile.js";
import Preferrence from "../models/preferrence.js";
import Roommate from "../models/roommate.js";

// ==========================================
// GET ALL USERS
// ==========================================
export const getAllUsers = async (_, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("get users error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ==========================================
// GET USER BY ID
// ==========================================
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("get user error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ==========================================
// DELETE USER
// ==========================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("delete user error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ==========================================
// GET ALL USER PROFILES
// ==========================================
export const getAllUserProfiles = async (_, res) => {
  try {
    const userProfiles = await UserProfile.find()
      .populate("userId", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: userProfiles.length,
      data: userProfiles,
    });
  } catch (error) {
    console.error("get user profiles error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET USER PROFILE BY ID
export const getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const userProfile = await UserProfile.findById(id)
      .populate("userId", "-password");

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error("get user profile error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// DELETE USER PROFILE
export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const userProfile = await UserProfile.findByIdAndDelete(id);

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile deleted successfully",
    });
  } catch (error) {
    console.error("delete user profile error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// GET ALL PREFERENCES
export const getPreferences = async (_, res) => {
  try {
    const preferences = await Preferrence.find()
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: preferences.length,
      data: preferences,
    });
  } catch (error) {
    console.error("get preferences error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ==========================================
// GET PREFERENCES BY USER ID
// ==========================================
export const getPreferencesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const preferences = await Preferrence.find({
      user: userId,
    })
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: preferences.length,
      data: preferences,
    });
  } catch (error) {
    console.error(
      "get preferences by userId error",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ==========================================
// DELETE PREFERENCE
// ==========================================
export const deletePreference = async (req, res) => {
  try {
    const { id } = req.params;

    const preference =
      await Preferrence.findByIdAndDelete(id);

    if (!preference) {
      return res.status(404).json({
        success: false,
        message: "Preference not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Preference deleted successfully",
    });
  } catch (error) {
    console.error("delete preference error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ADMIN DASHBOARD STATS
export const getDashBoardStats = async (_, res) => {
    try {
        const [
            totalUsers,
            activeUsers,
            inactiveUsers,
            totalUserProfiles,
            totalPreference,
            totalRoommate,
        ] = await Promise.all([
            User.countDocuments(),

            User.countDocuments({
                isActive: true,
            }),

            User.countDocuments({
                isActive: false,
            }),

            UserProfile.countDocuments(),

            Preferrence.countDocuments(),

            Roommate.countDocuments(),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                inactiveUsers,
                totalUserProfiles,
                totalPreference,
                totalRoommate,
            },
        });

    } catch (error) {
        console.error(
            "get dashboard stats error",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

