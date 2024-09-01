import express from 'express';
import { Student } from '../models/Student.js'; // Ensure this path is correct
import bcrypt from 'bcrypt';
const router = express.Router();
import { verifyAdmin } from './auth.js';

router.post('/register', verifyAdmin, async (req, res) => {
    try {
        const { username, password, roll, grade } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ username });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student is already registered' });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new student
        const newStudent = new Student({
            username,
            password: hashPassword,
            roll,
            grade
        });

        // Save the student
        await newStudent.save();

        return res.status(201).json({ registered: true });
    } catch (err) {
        console.error('Error registering student:', err); // Log the error
        return res.status(500).json({ message: 'Error in registering student' });
    }
});

export { router as studentRouter };
