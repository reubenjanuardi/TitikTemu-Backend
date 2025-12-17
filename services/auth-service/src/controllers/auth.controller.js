// Auth Controller
const authService = require("../services/auth.service");

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const result = await authService.register(email, password);
      return res
        .status(201)
        .json({ message: "User registered successfully", data: result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const result = await authService.login(email, password);
      return res
        .status(200)
        .json({ message: "Login successful", data: result });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  },

  validateToken: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const result = await authService.validateToken(token);
      return res
        .status(200)
        .json({ message: "Token is valid", data: result });
    } catch (error) {
      return res.status(403).json({ message: error.message });
    }
  },
};

