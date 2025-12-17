const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// simulasi database (memory)
const users = [];

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  const { nama, email, phone, password, confirmPassword } = req.body;

  if (!nama || !email || !phone || !password || !confirmPassword) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password tidak sama" });
  }

  const userExist = users.find(u => u.email === email);
  if (userExist) {
    return res.status(400).json({ message: "Email sudah terdaftar" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    nama,
    email,
    phone,
    password: hashedPassword
  });

  res.json({ message: "Register berhasil" });
});

/**
 * LOGIN + JWT
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Email tidak terdaftar" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Password salah" });
  }

  const token = jwt.sign(
    {
      email: user.email,
      nama: user.nama
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login berhasil",
    token
  });
});

module.exports = router;
//
