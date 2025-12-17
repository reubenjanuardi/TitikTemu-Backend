const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.route');
const eventRoutes = require('./routes/event.route');
const attendanceRoutes = require('./routes/attendance.route');
const venueRoutes = require('./routes/venue.route');

module.exports = (app) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || origin === allowedOrigin) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/venue', venueRoutes);

  // Fallback for unknown routes
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // Centralized error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = status === 500 ? 'Internal server error' : err.message || 'Request failed';
    if (!res.headersSent) {
      res.status(status).json({ success: false, message });
    }
  });
};
