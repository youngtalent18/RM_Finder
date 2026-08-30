import User from "../models/user.js"
import jwt from "jsonwebtoken"

export const protectRoute = async ( req,res, next) => {
  try {
    const accessToken =
      req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        error:
          "Unauthorized - no token",
      });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.accountStatus !== "active") {
        return res.status(403).json({
            success: false,
            message: `Account is ${ user.accountStatus} `,
        });
    }

    req.user = user;

    next();

  } catch (error) {
    console.log(
      "Protect route error:",
      error
    );

    return res.status(401).json({
      error: "Unauthorized",
    });
  }
};

export const adminRoute = async (req, res, next) => {
    try{
        if(req.user && req.user.role === "admin"){
            next();
        }else{
            return res.status(400).json({
                error: "Admin access only"
            })
        }
    }catch(error){
        console.log("Error in protectRoute controller", error);
        return res.status(500).json({
            error: "internal server error"
        });
    }
}