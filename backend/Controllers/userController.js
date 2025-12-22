const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, address } = req.body;

    //  validation
    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: "All fields required" });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      address,
    });

    // JWT payload
    const payload = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      address: newUser.address,
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: payload,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: payload,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ADMIN 
exports.adminDashboard = async (req, res) => {
  res.json({
    message: "Welcome Admin, this is your dashboard!",
  });
};



