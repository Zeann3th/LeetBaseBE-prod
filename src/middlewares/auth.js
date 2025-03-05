import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({ message: "Access token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.TOKEN_SECRET);
    // E.g: User logs out, refresh token = null but access token may still be valid
    // => Make sure isAuthenticated is true before doing
    const isAuthenticated = await Auth.findOne({ _id: { $eq: decoded.sub }, isAuthenticated: { $eq: true }, isEmailVerified: { $eq: true } });
    if (!isAuthenticated) {
      return res.status(401).send({ message: "User is not authenticated" });
    }

    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ message: "Invalid Token" });
  }
  return next();
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).send({ message: "Unauthorized" });
  }
  return next();
}

export const verifyCsrf = (req, res, next) => {
  if (req.headers["x-csrf-token"] !== req.cookies["_csrf"]) {
    return res.status(403).send({ message: "Unauthorized" });
  }
  return next();
}
