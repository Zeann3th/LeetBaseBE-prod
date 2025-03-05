import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";
import bcrypt from "bcrypt";
import { decrypt, encrypt } from "../utils.js";

const saltRounds = 10;

const register = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: "Missing required fields in payload" });
  }

  const user = await Auth.findOne({
    $or: [
      { username: { $eq: username } },
      { email: { $eq: email } }
    ]
  });
  if (user) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = new Auth({
    username,
    password: hashedPassword,
    email,
  });

  try {
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const verifyEmail = async (req, res) => {
  const hashedToken = req.params.token;
  try {
    const token = decrypt(hashedToken);

    const [_, expiresAt] = token.split(".");
    if (new Date(expiresAt) < new Date()) {
      return res.status(400).json({ message: "Token has expired" });
    }

    const user = await Auth.findOneAndUpdate(
      { emailVerificationToken: { $eq: hashedToken } },
      { isEmailVerified: true, emailVerificationToken: null }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found or Invalid token" });
    }

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const resendEmail = async (req, res) => {
}

const login = async (req, res) => {
  const { username, email, password } = req.body;
  const identifier = username || email;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Missing required fields in payload" });
  }

  try {
    const user = await Auth.findOne({
      $or: [
        { username: { $eq: identifier } },
        { email: { $eq: identifier } }
      ]
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      { sub: user._id, username: user.username, role: user.role },
      process.env.TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { sub: user._id, username: user.username, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await user.updateOne({ refreshToken, isAuthenticated: true });

    res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const refresh = async (req, res) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token is required" });
  }

  try {
    const user = await Auth.findOne({ refreshToken: { $eq: refreshToken } });
    if (!user) {
      return res.status(403).json({ message: "Refresh Token is invalid" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { sub: decoded._id, username: decoded.username, role: decoded.role },
      process.env.TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({ accessToken });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    return res.status(500).json({ message: err.message });
  }
}

const logout = async (req, res) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return res.status(204).send();
  }

  const user = await Auth.findOne({ refreshToken: { $eq: refreshToken } });
  if (user) {
    await user.updateOne({ refreshToken: null, isAuthenticated: false });
  }

  res.clearCookie("jwt");
  return res.status(204).send();
}

const AuthController = {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  resendEmail
}

export default AuthController;
