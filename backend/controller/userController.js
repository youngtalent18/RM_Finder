import User from "../models/user.js";
import crypto from "crypto"
import { generateTokens,setCookies } from "../lib/utils/generateToken.js";
import redis from "../config/redis.js";

const buildUserPayload = (user) => ({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage,
    isStudentVerified: user.isStudentVerified,
    isVerified: user.isVerified,
    accountStatus: user.accountStatus,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    {
      EX: 7 * 24 * 60 * 60,
    }
  );
};

export const registerUser = async(req, res) => {
    try {
        const { firstName, lastName, email, phone, password, } = req.body;

        if(!email || !password || !firstName || !lastName || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (email) {
            const isValidEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

            if (!isValidEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email",
                });
            }
        }

        const existingEmail = await User.findOne({ email });

        if(existingEmail) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            phone,
            isVerified: false,
        });

        // GENERATE VERIFICATION TOKEN
        const verifyToken = crypto
            .randomBytes(32)
            .toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(verifyToken)
            .digest("hex");

            user.verifyToken = hashedToken;

            user.verifyTokenExpire =
            Date.now() + 1000 * 60 * 60;

            await user.save();

            // SEND VERIFICATION EMAIL
            try {
                await sendVerificationEmail(
                    user,
                    verifyToken
                );
            } catch (emailErr) {
                console.log(
                    "Verification email error:",
                    emailErr.message
                );

                return res.status(502).json({
                    success: false,
                    message:
                        "Account created, but the verification email could not be sent. Please try resending the verification email.",
                });
            }

            return res.status(201).json({
                success: true,
                message:
                    "Account created. Check your email to verify.",
            });
        
        
    } catch (error) {
        console.log("Register error:", error);

        return res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
}

export const loginUser = async (req,res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (email) {
            const isValidEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

            if (!isValidEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email",
                });
            }
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (user.accountStatus !== "active") {
            return res.status(403).json({
                success: false,
                message: `Your account is ${ user.accountStatus} `,
            });
        }

            // EMAIL VERIFICATION CHECK
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email",
            });
        }


        const isMatch =
            await user.comparePassword(password);

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email or password",
                });
            }

        
        user.lastLogin = new Date();
        await user.save();

        const {accessToken,refreshToken} = await generateTokens(user._id);
        
            // STORE REFRESH TOKEN
            await storeRefreshToken(
              user._id,
              refreshToken
            );
        
            // SET COOKIES
            setCookies(
              res,
              accessToken,
              refreshToken
            );
        
            // RESPONSE
            return res.status(200).json({
              success: true,
        
              // OPTIONAL FOR FRONTEND
              accessToken,
        
              user: buildUserPayload(user),
            });

    } catch (error) {
        console.log("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const logoutUser = async (req, res) => {
  try {
    // DELETE REFRESH TOKEN
    if (req.user?._id) {
      await redis.del(
        `refresh_token:${req.user._id}`
      );
    }

    // CLEAR ACCESS TOKEN COOKIE
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure:
        process.env.NODE_ENV === "production",
    });

    // CLEAR REFRESH TOKEN COOKIE
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure:
        process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.log("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const refresh_token = async (req,res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message:
          "No refresh token provided",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // CHECK REDIS TOKEN
    const storedToken = await redis.get(
      `refresh_token:${decoded.userId}`
    );

    if (storedToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // CREATE NEW ACCESS TOKEN
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // SET NEW ACCESS TOKEN COOKIE
    res.cookie(
      "accessToken",
      accessToken,
      {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Access token refreshed",
    });

  } catch (error) {
    console.log(
      "Refresh token error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserProfile = async (req,res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.log("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email?.toLowerCase().trim();

    const user = await User.findOne({email: normalizedEmail});

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // GENERATE TOKEN
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpire = Date.now() + 1000 * 60 * 15;

    await user.save();

    // SEND EMAIL
    try {
      await sendResetEmail( user,resetToken );
    } catch (emailErr) {
      console.log(
        "Reset email error:",
        emailErr.message
      );

      return res.status(502).json({
        success: false,
        message:
          "Reset link could not be sent. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Reset link sent to email",
    });

  } catch (error) {
    console.log(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const resetPassword = async (
  req,
  res
) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken:
        hashedToken,

      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired token",
      });
    }

    user.password = password;

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpire =
      undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful",
    });

  } catch (error) {
    console.log(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const verifyEmail = async (
  req,
  res
) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verifyToken: hashedToken,

      verifyTokenExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired verification link",
      });
    }

    // VERIFY ACCOUNT
    user.isVerified = true;

    user.verifyToken = undefined;

    user.verifyTokenExpire =
      undefined;

    await user.save();

    // AUTO LOGIN
    const {accessToken,refreshToken} = await generateTokens(user._id);

    await storeRefreshToken(user._id,refreshToken);

    setCookies(
      res,accessToken,refreshToken);

    return res.status(200).json({
      success: true,
      message:
        "Email verified successfully",

      user: buildUserPayload(user),
    });

  } catch (error) {
    console.log(
      "Verify email error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const resendVerification = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message:
            "Email is required",
        });
      }

      const normalizedEmail = email
        .toLowerCase()
        .trim();

      // RATE LIMIT
      const cooldownKey =
        `resend_verify:${normalizedEmail}`;

      const ttl = await redis.ttl(
        cooldownKey
      );

      if (ttl > 0) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${ttl}s before requesting another email`,
          retryAfter: ttl,
        });
      }

      await redis.set(
        cooldownKey,
        "1",
        {
          EX: 60,
        }
      );

      // FIND USER
      const user =
        await User.findOne({
          email: normalizedEmail,
        });

      // PREVENT ENUMERATION
      if (!user) {
        return res.status(200).json({
          success: true,
          message:
            "If an account exists, a verification email has been sent",
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message:
            "Account already verified",
        });
      }

      // GENERATE TOKEN
      const verifyToken = crypto
        .randomBytes(32)
        .toString("hex");

      const hashedToken = crypto
        .createHash("sha256")
        .update(verifyToken)
        .digest("hex");

      user.verifyToken =
        hashedToken;

      user.verifyTokenExpire =
        Date.now() +
        1000 * 60 * 60;

      await user.save();

      // SEND EMAIL
      try {
        await sendVerificationEmail(user,verifyToken,true);
      } catch (emailErr) {
        console.log("Verification resend email error:",emailErr.message);

        return res.status(502).json({
          success: false,
          message:
            "Verification email could not be sent. Please try again later.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Verification email resent successfully",
        retryAfter: 60,
      });

    } catch (error) {
      console.log("Resend verification error:",error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
};