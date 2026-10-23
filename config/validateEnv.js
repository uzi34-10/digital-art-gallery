/**
 * Environment Variable Validator
 * Validates critical environment variables at startup before server starts.
 */

const validateEnv = () => {
  const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
  const missing = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar] || process.env[envVar].trim() === '') {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error(
      `FATAL: Missing required environment variables: ${missing.join(', ')}`
    );
    console.error('Please verify your .env file or deployment environment settings.');
    process.exit(1);
  }

  // Set defaults for optional vars if not specified
  process.env.PORT = process.env.PORT || '5000';
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
};

module.exports = validateEnv;
