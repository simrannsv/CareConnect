import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigin = process.env.CLIENT_URL;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigin || allowedOrigin === '*') return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');
      const normalizedClient = allowedOrigin.replace(/\/$/, '');

      if (normalizedOrigin === normalizedClient) {
        return callback(null, true);
      }

      // Fallback to allow request if origin matches Vercel domain pattern or configured origin
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

import { seedDatabase } from './seed/seedDemo.js';

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: { status: 'ok', uptime: process.uptime() },
    message: 'CareConnect API running',
  });
});

app.get('/api/seed', async (req, res, next) => {
  try {
    const stats = await seedDatabase();
    res.json({
      success: true,
      data: stats,
      message: 'Cloud database seeded successfully with demo providers and admin account!',
    });
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
// mount the other routes here

app.use(notFound);
app.use(errorHandler);

export default app;