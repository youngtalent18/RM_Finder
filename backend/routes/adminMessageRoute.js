import express from "express";

import {
  getAllMessages,
  getMessagesBetweenUsers,
  adminDeleteMessage,
} from "../controller/adminMessage.js";

import {
  protectRoute,
  adminRoute,
} from "../middleware/protectRoute.js";


const router = express.Router();


// ADMIN PROTECTION
// Every route below requires:
// 1. Logged-in user
// 2. Admin role

router.use(protectRoute);
router.use(adminRoute);


// GET ALL MESSAGES

router.get(
  "/",
  getAllMessages
);


// GET MESSAGES BETWEEN TWO USERS

router.get(
  "/:userId1/:userId2",
  getMessagesBetweenUsers
);


// DELETE MESSAGE

router.delete(
  "/:messageId",
  adminDeleteMessage
);


export default router;
