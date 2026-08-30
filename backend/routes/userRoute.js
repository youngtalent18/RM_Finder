import express from "express"
import { forgotPassword, getUserProfile, 
        loginUser, logoutUser, 
        refresh_token, registerUser, 
        resendVerification, 
        resetPassword,
        verifyEmail} from "../controller/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refresh_token);
router.get('/profile',protectRoute, getUserProfile);

//Password Reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

//User verification
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

export default router;