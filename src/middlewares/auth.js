import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({ message: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.TOKEN_SECRET);
    const isAuthenticated = await Auth.findOne({ _id: { $eq: decoded.sub }, isAuthenticated: { $eq: true } });
    console.log(isAuthenticated);
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
