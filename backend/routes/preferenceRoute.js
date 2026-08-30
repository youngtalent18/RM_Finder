import express from "express"
import { createPreference, deletePreference, getMyPreference, updatePreference } from "../controller/preferrenceController.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()

router.post("/", protectRoute, createPreference );
router.get("/me",protectRoute, getMyPreference);
router.put("/",protectRoute, updatePreference);
router.put("/",protectRoute, deletePreference);

export default router;