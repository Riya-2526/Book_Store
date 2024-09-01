import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Admin } from './models/Admin.js';

dotenv.config(); // Ensure environment variables are loaded

async function AdminAccount() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }
    
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Check if any admin accounts already exist
    const adminCount = await Admin.countDocuments();

    if (adminCount === 0) {
      // Hash the password
      const hashedPassword = await bcrypt.hash('adminpassword', 10);

      // Create a new admin instance
      const newAdmin = new Admin({
        username: 'admin',
        password: hashedPassword,
      });

      // Save the new admin account to the database
      await newAdmin.save();
      console.log("Admin account created successfully");
    } else {
      console.log("Admin account already exists");
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error setting up admin account:", err);
  }
}

// Execute the function to set up the admin account
AdminAccount();
