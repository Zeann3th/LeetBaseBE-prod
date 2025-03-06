import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";
import bcrypt from "bcrypt";
import { isProduction, sanitize } from "../utils.js";
import { sendVerifyEmail, sendRecoveryEmail } from "../services/smtp.js";
import cache from "../services/cache.js";

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

  try {
    await Auth.save({
      username,
      password: hashedPassword,
      email,
    });
    sendVerifyEmail(email);
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const verifyEmail = async (req, res) => {
  const pin = sanitize(req.body.pin, "number");
  const email = sanitize(req.body.email, "email");

  if (!pin || !email) {
    return res.status(400).json({ message: "Missing required fields in payload" });
  }

  try {
    const cachedPin = await cache.get(`verify:${req.body.email}`);
    if (!cachedPin) {
      return res.status(400).json({ message: "Invalid or expired pin" });
    }

    if (req.body.pin !== cachedPin) {
      return res.status(400).json({ message: "Invalid or expired pin" });
    }

    await Promise.all([
      Auth.findOneAndUpdate({ email: { $eq: req.body.email } }, { isVerified: true }),
      cache.del(`verify:${req.body.email}`)
    ]);
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const resendEmail = async (req, res) => {
  const action = sanitize(req.query.action, "string");
  const email = sanitize(req.body.email, "email");

  if (!email || !action) {
    return res.status(400).json({ message: "Missing required fields in payload" });
  }

  try {
    action = action.toLowerCase();
    if (action === "verify") {
      await sendVerifyEmail(email);
    } else if (action === "recover") {
      await sendRecoveryEmail(email);
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
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

    const payload = { sub: user._id, username: user.username, role: user.role };

    const accessToken = jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const csrfToken = crypto.randomUUID();

    await user.updateOne({ refreshToken, isAuthenticated: true });

    const cookieOptions = { httpOnly: true, secure: isProduction };

    res.cookie("refresh_token", refreshToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });
    res.cookie("_csrf", csrfToken, cookieOptions);
    return res.status(200).json({ accessToken, csrfToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token is required" });
  }

  try {
    const user = await Auth.findOne({ refreshToken: { $eq: refreshToken } });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh tokend" });
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
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(204).send();
  }

  const user = await Auth.findOne({ refreshToken: { $eq: refreshToken } });
  if (user) {
    await user.updateOne({ refreshToken: null, isAuthenticated: false });
  }

  const cookieOptions = { httpOnly: true, secure: isProduction };

  res.clearCookie("refresh_token", cookieOptions);
  res.clearCookie("_csrf", cookieOptions);
  return res.status(204).send();
}

const update = async (req, res) => {

}

const AuthController = {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  resendEmail,
  update,
}

export default AuthController;
