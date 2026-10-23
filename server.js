require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose');

const validateEnv = require('./config/validateEnv');
const { connectDB, disconnectDB } = require('./config/db');
const sanitizeInput = require('./middleware/sanitizeInput');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const artistRoutes = require('./routes/artistRoutes');
const artworkRoutes = require('./routes/artworkRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const exhibitionRoutes = require('./routes/exhibitionRoutes');

// 1. Validate environment configuration
validateEnv();

const app = express();

// Trust reverse proxies (Heroku, AWS ALB, Nginx, Render, Cloudflare)
app.set('trust proxy', 1);

// 2. Global Security and Performance Middlewares
app.use(helmet());
app.use(compression());

// Configurable CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging: structured/combined in production, compact dev in development
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Request payload limits to mitigate payload exhaustion attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Input sanitization against MongoDB operator injection
app.use(sanitizeInput);

// 3. Health check endpoints (load balancers & monitoring)
app.get(['/health', '/api/health'], (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isHealthy = dbState === 1;
  const status = isHealthy ? 'ok' : 'degraded';
  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    status,
    uptime: `${process.uptime().toFixed(0)}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      status: dbStatusMap[dbState] || 'unknown',
    },
    memory: {
      rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
    },
  });
});

// 4. Rate-limited API Routes
app.use('/api', apiLimiter);

// Root API information
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Digital Art Gallery Management System API',
    version: '1.0.0',
    documentation: '/docs/API_DOCUMENTATION.md',
    status: 'online',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/exhibitions', exhibitionRoutes);

// 5. 404 Handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found on endpoint: ${req.method} ${req.originalUrl}`,
  });
});

// 6. Global Error Handling Middleware
app.use(errorHandler);

// 7. Start Server & Initiate DB Connection
const PORT = process.env.PORT || 5000;
let server;

const startServer = () => {
  server = app.listen(PORT, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    // Connect to DB asynchronously with automatic reconnect logic
    connectDB().catch((err) => {
      console.error(`[Server] Initial DB connection attempt failed: ${err.message}`);
    });
  });
};

startServer();

// 8. Graceful Shutdown Handlers (SIGTERM, SIGINT)
const gracefulShutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      await disconnectDB();
      console.log('[Server] Graceful shutdown completed.');
      process.exit(0);
    });

    // Force close if graceful shutdown hangs
    setTimeout(() => {
      console.error('[Server] Could not close connections in time, forcefully shutting down.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled exceptions and promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

module.exports = app;
