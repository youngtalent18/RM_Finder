import express from "express";
import {
  sendMessage,
  getMyConversations,
  getConversation,
  markMessageAsRead,
  getUnreadMessageCount,
  deleteMyMessage,
  getUsersForNewMessage,
} from "../controller/messageController.js";

import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();


// USER MESSAGES
router.get(
    "/users",
    protectRoute,
    getUsersForNewMessage
);

// Send message
router.post(
  "/",
  protectRoute,
  sendMessage
);


// Get all my conversations
router.get(
  "/conversations",
  protectRoute,
  getMyConversations
);


// Get unread message count
router.get(
  "/unread/count",
  protectRoute,
  getUnreadMessageCount
);


// Get conversation with a specific user
router.get(
  "/:userId",
  protectRoute,
  getConversation
);


// Mark message as read
router.patch(
  "/:messageId/read",
  protectRoute,
  markMessageAsRead
);


// Delete own message
router.delete(
  "/:messageId",
  protectRoute,
  deleteMyMessage
);


export default router;