const express = require('express');
const { buildProxy } = require('../proxy/service.proxy');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();
const routePrefix = '/api/attendance';
const target = process.env.ATTENDANCE_SERVICE_URL;

router.use(verifyToken);
router.use(buildProxy(routePrefix, target));

module.exports = router;
