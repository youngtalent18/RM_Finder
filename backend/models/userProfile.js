import mongoose, { Schema } from "mongoose";

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      default: undefined,
    },

    dateOfBirth: {
      type: Date,
    },

    bio: {
      type: String,
      maxLength: 500,
      trim: true,
    },

    course: {
      type: String,
      trim: true,
    },

    school: {
      type: String,
      trim: true,
    },

    level: {
      type: String,
      trim: true,
    },

    location: {
      city: {
        type: String,
        trim: true,
      },

      region: {
        type: String,
        trim: true,
      },

      country: {
        type: String,
        trim: true,
        default: "Ghana",
      },
    },

    occupation: {
      type: String,
      trim: true,
    },

    budget: {
      min: {
        type: Number,
        min: 0,
      },

      max: {
        type: Number,
        min: 0,
      },

      currency: {
        type: String,
        trim: true,
        default: "GHS",
      },
    },

    moveInDate: {
      type: Date,
    },

    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserProfile = mongoose.model("UserProfile", ProfileSchema);

export default UserProfile;