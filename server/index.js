import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./db.js";
import { AdminRouter } from "./routes/auth.js";
import { studentRouter } from "./routes/student.js";
import { bookRouter } from "./routes/book.js";
import { Book } from "./models/Book.js";
import { Student } from "./models/Student.js";
import { Admin } from "./models/Admin.js";

dotenv.config();

const app = express();
app.use(express.json());

// Define allowed origins from environment variable
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000', // Fallback to localhost if not defined
];

console.log("Frontend URL:", process.env.FRONTEND_URL);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error(`Blocked CORS request from origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(cookieParser());
app.use("/auth", AdminRouter);
app.use("/student", studentRouter);
app.use("/book", bookRouter);

app.get("/dashboard", async (req, res) => {
  try {
    const student = await Student.countDocuments();
    const admin = await Admin.countDocuments();
    const book = await Book.countDocuments();
    return res.json({ ok: true, students: student, books: book, admin: admin });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
