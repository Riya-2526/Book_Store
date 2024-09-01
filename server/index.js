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

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://stellular-monstera-aae9cb.netlify.app/"],
    credentials: true,
  })
);
app.use(cookieParser());
dotenv.config();
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
