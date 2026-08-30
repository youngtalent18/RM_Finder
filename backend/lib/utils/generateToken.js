import jwt from "jsonwebtoken"

export const generateTokens = async(userId) =>{
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});

    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});

    return {accessToken, refreshToken};
}


export const setCookies = (
  res,
  accessToken,
  refreshToken
) => {
  const isProduction =
    process.env.NODE_ENV === "production";

  res.cookie(
    "accessToken",
    accessToken,
    {
      httpOnly: true,
      secure: isProduction,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    }
  );

  res.cookie(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,
      secure: isProduction,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    }
  );
};