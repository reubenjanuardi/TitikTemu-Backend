const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
});

// Public routes
router.post('/register', authProxy);
router.post('/login', authProxy);

// Protected routes
router.use(verifyToken);
router.use(authProxy);

module.exports = router;