import mongoose, { Schema } from "mongoose";

const roommateSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxLength: 300,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

roommateSchema.index({ sender: 1, recipient: 1 });

const Roommate = mongoose.model("Roommate", roommateSchema);

export default Roommate;
