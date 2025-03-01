import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({ message: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.TOKEN_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ message: "Invalid Token" });
  }
  return next();
};
