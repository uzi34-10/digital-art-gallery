# ==========================================
# Production Dockerfile
# Multi-stage optimized Node.js container
# ==========================================

FROM node:18-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy application source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose server port
EXPOSE 5000

# Run container as non-root user
USER node

# Health check to monitor container health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Launch application with dumb-init
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
