import express from "express";

import {
  createProfile,
  getMyProfile,
  deleteProfile,
  getUserProfileById,
  updateProfile,
  getRoommateProfiles,
} from "../controller/userProfileController.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();


router.post(
  "/createProfile",
  protectRoute,
  createProfile
);


router.get(
  "/personal",
  protectRoute,
  getMyProfile
);

router.get(
  "/roommates",
  protectRoute,
  getRoommateProfiles
);


router.get(
  "/personal/:id",
  protectRoute,
  getUserProfileById
);


router.put(
  "/personal",
  protectRoute,
  updateProfile
);


router.delete(
  "/personal",
  protectRoute,
  deleteProfile
);


export default router;
