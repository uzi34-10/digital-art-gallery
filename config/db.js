const mongoose = require('mongoose');

let isConnecting = false;
let retryTimer = null;

/**
 * Connect to MongoDB with automatic retry and production connection pooling
 */
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }

  if (isConnecting) {
    return;
  }

  isConnecting = true;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    isConnecting = false;
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`[MongoDB] Connection Error: ${error.message}`);
    console.log('[MongoDB] Retrying connection in 10 seconds...');

    if (!retryTimer) {
      retryTimer = setTimeout(() => {
        retryTimer = null;
        connectDB();
      }, 10000);
    }
  }
};

// Monitor connection events
mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] Runtime Connection Error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from server. Initiating reconnect...');
  connectDB();
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected to server.');
});

/**
 * Gracefully close database connection
 */
const disconnectDB = async () => {
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }

  try {
    await mongoose.connection.close(false);
    console.log('[MongoDB] Connection closed gracefully.');
  } catch (err) {
    console.error(`[MongoDB] Error closing connection: ${err.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
