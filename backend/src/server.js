import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const configuredOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
  ...configuredOrigins,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'Fresher Cafe backend is running',
    health: '/api/health',
    apiBase: '/api',
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  if (error?.code === 11000) {
    return res.status(400).json({ message: 'Duplicate value not allowed' });
  }

  const message = error?.message || 'Internal server error';
  return res.status(500).json({ message });
});

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`MERN backend running on http://localhost:${port}`);
  });
};

start().catch((error) => {
  console.error('Failed to start backend:', error.message);
  process.exit(1);
});
