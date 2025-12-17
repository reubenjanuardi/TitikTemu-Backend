// Auth Service
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = {
  register: async (email, password) => {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      role: "PARTICIPANT",
    });

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  login: async (email, password) => {
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  validateToken: async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        throw new Error("User not found");
      }

      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error("Invalid token");
    }
  },
};

