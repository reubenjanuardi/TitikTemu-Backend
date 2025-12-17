const express = require('express');
const { buildProxy } = require('../proxy/service.proxy');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const authProxy = buildProxy('/api/auth', `${AUTH_SERVICE_URL}/auth`);

/* =========================
   PUBLIC ROUTES
========================= */
router.post('/register', authProxy);
router.post('/login', authProxy);

/* =========================
   PROTECTED ROUTE
========================= */
router.post('/validate', verifyToken, authProxy);

module.exports = router;
