import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getRoommateRequests, sendRoommateRequest, updateRoommateRequest } from "../controller/roommateController.js";

const router = express.Router();

router.use(protectRoute);
router.get("/requests", getRoommateRequests);
router.post("/requests/:recipientId", sendRoommateRequest);
router.patch("/requests/:requestId", updateRoommateRequest);

export default router;
