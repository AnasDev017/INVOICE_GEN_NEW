import jwt from "jsonwebtoken";

export const tokenVerifcation = (req, res, next) => {
  // Try to get token from cookie first (same-origin)
  let access_token = req.cookies.access_token;
  
  // If not in cookie, check Authorization header (cross-origin)
  if (!access_token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      access_token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }

  if (!access_token) {
    return res.status(401).json({ msg: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(
      access_token,
      process.env.JWT_SECRET_KEY
    );

    req.user = { _id: decoded.userId };

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

