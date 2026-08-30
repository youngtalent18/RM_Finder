import express from "express";

import {
  createListing,
  getAllListings,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
} from "../controller/listingController.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();


// ============================================
// PUBLIC
// ============================================

router.get("/", getAllListings);

router.get("/:id", getListingById);


// ============================================
// AUTHENTICATED
// ============================================

router.post("/", protectRoute, createListing);

router.get("/mine", protectRoute, getMyListings);

router.put("/:id", protectRoute, updateListing);

router.delete("/:id", protectRoute, deleteListing);


export default router;