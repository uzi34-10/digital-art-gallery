/**
 * Middleware to sanitize user input and prevent MongoDB operator injection.
 * Recursively removes keys starting with '$' or containing '.' from req.body, req.query, and req.params.
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Drop keys that contain MongoDB injection operators
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
};

const sanitizeInput = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

module.exports = sanitizeInput;
