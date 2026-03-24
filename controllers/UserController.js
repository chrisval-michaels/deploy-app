import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";


// REGISTER USER
export const register = async (req, res) => {

  try {

    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      throw new AppError("All fields are required", 400);
    }
    
    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    //(Task 2 Duplicate email check )
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }

    
    const newUser = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser
    });

  } catch (error) {

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: "Internal server error"
    });

  }

};



// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new AppError("Email and password required", 400);

    const user = await User.findOne({ email });
    if (!user) throw new AppError("Invalid credentials", 401);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new AppError("Invalid credentials", 401);

    // Store user info in session
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role || 'user'  // default role is 'user'
    };

    res.status(200).json({ message: "Login successful" });

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    res.status(500).json({ error: 'Failed to delete user' });
  }
};


// LOGOUT USER
export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Failed to logout" });
    res.clearCookie('connect.sid');  // optional: clear cookie in browser
    res.json({ message: "Logout successful" });
  });
};