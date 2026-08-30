import mongoose from "mongoose";
const listingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      minlength: 20,
      trim: true,
    },

    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },

      region: {
        type: String,
        required: true,
        trim: true,
      },
    },

    roomType: {
      type: String,
      required: true,
      enum: ["single", "shared", "studio"],
    },

    furnished: {
      type: Boolean,
      default: false,
    },

    availableRooms: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentPeriod: {
      type: String,
      required: true,
      enum: ["monthly", "semester", "yearly"],
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
const Listing = mongoose.model("Listing", listingSchema);
export default Listing;