const { createProxyMiddleware } = require('http-proxy-middleware');

const buildProxy = (routePrefix, target) => {
  if (!target) {
    throw new Error(`Missing target for route ${routePrefix}`);
  }

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      [`^${routePrefix}`]: '',
    },
    logLevel: 'warn',
    onError: (err, req, res) => {
      // Avoid leaking internal details; present a generic upstream error.
      if (!res.headersSent) {
        res.status(502).json({ success: false, message: 'Upstream service unavailable' });
      }
    },
  });
};

module.exports = {
  buildProxy,
};
