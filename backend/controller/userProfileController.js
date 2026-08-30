import UserProfile from "../models/userProfile.js";
import cloudinary from "../lib/utils/cloudinary.js";

export const createProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Prevent duplicate profiles
    const existingProfile = await UserProfile.findOne({
      user: userId,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const {
      bio, gender, dateOfBirth, school, course, level, occupation, location, budget, moveInDate, profileImage} = req.body;

    let imageUrl = null;

    if (profileImage) {
      if (profileImage.startsWith("http")) {
        imageUrl = profileImage;
      } else {
        const result = await cloudinary.uploader.upload(profileImage, {
          folder: "profileImages",
        });

        imageUrl = result.secure_url;
      }
    }


    const profile = await UserProfile.create({
      user: userId,

      profileImage: imageUrl,

      bio,
      gender,
      dateOfBirth,
      school,
      course,
      level,
      occupation,

      location: {
        city: location?.city || "",
        region: location?.region || "",
        country: location?.country || "Ghana",
      },

      budget: {
        min: budget?.min,
        max: budget?.max,
        currency: budget?.currency || "GHS",
      },

      moveInDate,

      isProfileCompleted: true,
    });

    const populatedProfile = await UserProfile.findById(
      profile._id
    ).populate("user", "-password");

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: populatedProfile,
    });
  } catch (error) {
    console.error("create profile error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Profile creation failed",
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await UserProfile.findOne({
      user: userId,
    }).populate("user", "-password");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("get my profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await UserProfile.findOne({
      user: id,
    }).populate("user", "-password");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("get user profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await UserProfile.findOne({
      user: userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const allowedFields = [
      "bio",
      "gender",
      "dateOfBirth",
      "school",
      "course",
      "level",
      "occupation",
      "moveInDate",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    /*
    | UPDATE LOCATION
    */

    if (req.body.location) {
      profile.location = {
        city: req.body.location.city ?? profile.location?.city ?? "",
        region:
          req.body.location.region ??
          profile.location?.region ??
          "",
        country:
          req.body.location.country ??
          profile.location?.country ??
          "Ghana",
      };
    }

    /*
    | UPDATE BUDGET
    */

    if (req.body.budget) {
      profile.budget = {
        min:
          req.body.budget.min ??
          profile.budget?.min,

        max:
          req.body.budget.max ??
          profile.budget?.max,

        currency:
          req.body.budget.currency ??
          profile.budget?.currency ??
          "GHS",
      };
    }

    /*
    | UPDATE IMAGE
    */

    if (req.body.profileImage) {
      let imageUrl = req.body.profileImage;

      if (!req.body.profileImage.startsWith("http")) {
        const result = await cloudinary.uploader.upload(
          req.body.profileImage,
          {
            folder: "profileImages",
          }
        );

        imageUrl = result.secure_url;
      }

      profile.profileImage = imageUrl;
    }

    profile.isProfileCompleted = true;

    await profile.save();

    const updatedProfile = await UserProfile.findById(
      profile._id
    ).populate("user", "-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("update profile error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Profile update failed",
    });
  }
};


/*
| DELETE PROFILE
*/

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await UserProfile.findOneAndDelete({
      user: userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("delete profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Profile deletion failed",
    });
  }
};

export const getRoommateProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.find({ user: { $ne: req.user._id } })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: profiles,
      count: profiles.length,
    });
  } catch (error) {
    console.error("get roommate profiles error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch roommate profiles" });
  }
};
