import mongoose from "mongoose";
import Roommate from "../models/roommate.js";
import User from "../models/user.js";

const populateRequest = (query) => query
  .populate("sender", "firstName lastName email")
  .populate("recipient", "firstName lastName email");

export const sendRoommateRequest = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const { message = "" } = req.body;
    const senderId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ success: false, message: "Invalid recipient" });
    }
    if (senderId.toString() === recipientId) {
      return res.status(400).json({ success: false, message: "You cannot send a request to yourself" });
    }

    const recipient = await User.findOne({ _id: recipientId, role: "student", accountStatus: "active" });
    if (!recipient) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const existing = await Roommate.findOne({
      $or: [
        { sender: senderId, recipient: recipientId, status: { $in: ["pending", "accepted"] } },
        { sender: recipientId, recipient: senderId, status: { $in: ["pending", "accepted"] } },
      ],
    });
    if (existing) {
      return res.status(409).json({ success: false, message: "A roommate request already exists between you" });
    }

    const request = await Roommate.create({ sender: senderId, recipient: recipientId, message });
    return res.status(201).json({ success: true, message: "Roommate request sent", data: await populateRequest(Roommate.findById(request._id)) });
  } catch (error) {
    console.error("Send roommate request error:", error);
    return res.status(500).json({ success: false, message: "Unable to send roommate request" });
  }
};

export const getRoommateRequests = async (req, res) => {
  try {
    const { type = "all" } = req.query;
    const userId = req.user._id;
    const filter = type === "incoming" ? { recipient: userId } : type === "outgoing" ? { sender: userId } : { $or: [{ sender: userId }, { recipient: userId }] };
    const requests = await populateRequest(Roommate.find(filter).sort({ createdAt: -1 }));
    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("Get roommate requests error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch roommate requests" });
  }
};

export const updateRoommateRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(requestId) || !["accepted", "declined", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid request update" });
    }

    const request = await Roommate.findById(requestId);
    if (!request || request.status !== "pending") {
      return res.status(404).json({ success: false, message: "Pending roommate request not found" });
    }
    const isRecipient = request.recipient.toString() === req.user._id.toString();
    const isSender = request.sender.toString() === req.user._id.toString();
    if ((status === "cancelled" && !isSender) || (status !== "cancelled" && !isRecipient)) {
      return res.status(403).json({ success: false, message: "You cannot update this request" });
    }

    request.status = status;
    await request.save();
    return res.status(200).json({ success: true, message: `Request ${status}`, data: await populateRequest(Roommate.findById(request._id)) });
  } catch (error) {
    console.error("Update roommate request error:", error);
    return res.status(500).json({ success: false, message: "Unable to update roommate request" });
  }
};
