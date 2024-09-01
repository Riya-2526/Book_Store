import express from "express";
import { Admin } from "../models/Admin.js"; // Ensure this path is correct
import { Student } from "../models/Student.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from "cors";

const router = express.Router();

// Middleware to parse cookies
router.use(cookieParser());

// CORS Configuration
router.use(cors({ origin: 'https://stellular-monstera-aae9cb.netlify.app', credentials: true }));

// Helper function to generate JWT tokens
const generateToken = (user, role, secretKey) => {
  return jwt.sign({ username: user.username, role }, secretKey, { expiresIn: "1h" });
};

// Helper function to verify tokens
const verifyToken = (token, secretKey, callback) => {
  jwt.verify(token, secretKey, callback);
};

// Route for login
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user;
    let roleSecretKey;

    if (role === "admin") {
      user = await Admin.findOne({ username });
      roleSecretKey = process.env.Admin_Key;
    } else if (role === "student") {
      user = await Student.findOne({ username });
      roleSecretKey = process.env.Student_Key;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} not registered` });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = generateToken(user, role, roleSecretKey);
    // Set secure: true for production use
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

    return res.json({ login: true, role });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Middleware to verify Admin token
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  verifyToken(token, process.env.Admin_Key, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.username = decoded.username;
    req.role = decoded.role;
    next();
  });
};

// Middleware to verify either Admin or Student token
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  verifyToken(token, process.env.Admin_Key, (adminErr, adminDecoded) => {
    if (adminErr) {
      verifyToken(token, process.env.Student_Key, (studentErr, studentDecoded) => {
        if (studentErr) {
          return res.status(401).json({ message: "Invalid token" });
        } else {
          req.username = studentDecoded.username;
          req.role = studentDecoded.role;
          next();
        }
      });
    } else {
      req.username = adminDecoded.username;
      req.role = adminDecoded.role;
      next();
    }
  });
};

// Verification route
router.get("/verify", verifyUser, (req, res) => {
  return res.json({ login: true, role: req.role });
});

// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ logout: true });
});

export { router as AdminRouter, verifyAdmin };
