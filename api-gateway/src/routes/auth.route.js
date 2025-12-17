const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path, req) => `/auth${path}`,
});

// Public routes (no JWT required)
router.post('/register', authProxy);
router.post('/login', authProxy);

// Protected routes (JWT required)
router.use(verifyToken);
router.use(authProxy); // All other /api/auth/* routes require auth

module.exports = router;