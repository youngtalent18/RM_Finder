import express from "express"
import { protectRoute, adminRoute } from "../middleware/protectRoute.js";
import { getPreferences, getPreferencesByUserId, deletePreference,
         getDashBoardStats,getAllUsers, getUserById, deleteUser,
         getAllUserProfiles, getUserProfileById, deleteUserProfile  } from "../controller/adminController.js";

const router = express.Router();

router.use(protectRoute,adminRoute);

router.get("/", getDashBoardStats);

router.get("/users", getAllUsers); //test sucess for all below
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

router.get("/profiles", getAllUserProfiles);
router.get("/profiles/:id", getUserProfileById);
router.delete("/profiles/:id", deleteUserProfile);

router.get("/preferences", getPreferences);
router.get("/preferences/users/:userId", getPreferencesByUserId);
router.delete("/preferences/:id", deletePreference);

export default router;