import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { signToken } from "../config/auth.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt
});

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name"
      });
    }

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email is required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with that email already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({
      success: true,
      token: signToken(user._id),
      user: publicUser(user)
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to create account"
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.findOne({ email });

    const ok = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password"
      });
    }

    res.json({
      success: true,
      token: signToken(user._id),
      user: publicUser(user)
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to sign in"
    });
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Session no longer valid"
      });
    }

    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to load account"
    });
  }
};
