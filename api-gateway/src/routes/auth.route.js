const express = require('express');
const { buildProxy } = require('../proxy/service.proxy');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();
const routePrefix = '/api/auth';
const target = process.env.AUTH_SERVICE_URL;
const proxy = buildProxy(routePrefix, target);

const publicPaths = ['/login', '/register'];

router.use((req, res, next) => {
  if (publicPaths.includes(req.path.toLowerCase())) {
    return next();
  }
  return verifyToken(req, res, next);
});

router.use(proxy);

module.exports = router;
