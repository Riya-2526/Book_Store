import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './db.js';
import { AdminRouter } from './routes/auth.js';
import { studentRouter } from './routes/student.js';
import { bookRouter } from './routes/book.js';
import { Book } from './models/Book.js';
import { Student } from './models/Student.js';
import { Admin } from './models/Admin.js';

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
app.use(
  cors({
    origin: 'https://stellular-monstera-aae9cb.netlify.app', // Your frontend URL without trailing slash
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', AdminRouter);
app.use('/student', studentRouter);
app.use('/book', bookRouter);

app.get('/dashboard', async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const adminCount = await Admin.countDocuments();
    const bookCount = await Book.countDocuments();
    return res.json({ ok: true, students: studentCount, books: bookCount, admin: adminCount });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
