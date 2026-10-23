# Digital Art Gallery Management System (Production-Ready)

A comprehensive, production-grade Node.js REST API backend for managing a Digital Art Gallery. This project implements enterprise-level security, role-based authorization, rate limiting, MongoDB injection protection, Gzip compression, input validation across all routes, health checks, graceful shutdown, and containerization.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Production Architecture](#production-architecture)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Database Schema & Indexes](#database-schema--indexes)
- [Production Security & Hardening](#production-security--hardening)
- [Setup & Deployment Instructions](#setup--deployment-instructions)
  - [Local Development](#local-development)
  - [Docker & Docker Compose](#docker--docker-compose)
  - [PM2 Process Management](#pm2-process-management)
- [Environment Variables](#environment-variables)
- [API Documentation & Health Monitoring](#api-documentation--health-monitoring)
- [Error Handling & Resilience](#error-handling--resilience)

---

## Project Overview

**Digital Art Gallery Management System** is an enterprise-grade RESTful API designed to manage artists, art collections, categories, and exhibitions with top-tier performance, security, and uptime guarantees.

### Key Production Features
✅ **Privilege Escalation Protection**: Prevents arbitrary users from registering as administrators without server-side authorization credentials.  
✅ **Multi-Tier Rate Limiting**: Global rate limiting (200 req/15m) and strict authentication rate limiting (15 attempts/15m) to defend against DDoS and brute-force attacks.  
✅ **NoSQL Injection Defense**: Recursive input sanitization stripping MongoDB operators (`$`, `.`) from request bodies, queries, and parameters.  
✅ **Comprehensive Input Validation**: Built using `express-validator` on **all** endpoints (validating ObjectIDs, string boundaries, numerical ranges, and ISO dates).  
✅ **High-Performance Compression**: Response compression via `compression` (Gzip/Deflate).  
✅ **Production Health Monitoring**: Real-time `/health` endpoint reporting uptime, memory usage, and database state for AWS ALB, Nginx, Kubernetes, and Docker health checks.  
✅ **Resilient Database Layer**: MongoDB connection pooling (`maxPoolSize: 10`, `minPoolSize: 2`), automatic reconnects, and graceful shutdown (handling SIGTERM/SIGINT signals).  
✅ **Production Containerization**: Multi-stage `Dockerfile`, `docker-compose.yml`, and PM2 cluster configuration (`ecosystem.config.js`).  

---

## Production Architecture

### Request Flow Pipeline

```text
Incoming HTTP Request (Reverse Proxy / Load Balancer)
    ↓
Trust Proxy & Security Headers (Helmet)
    ↓
Gzip/Deflate Compression (compression)
    ↓
CORS Policy Check (cors)
    ↓
Request Payload Limits (10kb max body)
    ↓
Input Sanitization (Strip $ and . operators)
    ↓
Rate Limiter (apiLimiter / authLimiter)
    ↓
Router Matching (/api/auth, /api/artworks, etc.)
    ↓
Token Verification (JWT verifyToken)
    ↓
Role-Based Authorization (authorizeRole)
    ↓
Input Validator (express-validator rules)
    ↓
Controller (Business Logic)
    ↓
Mongoose Model (Indexed MongoDB Query)
    ↓
MongoDB Atlas Cluster
    ↓
JSON Response
```

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | v18+ | JavaScript runtime |
| **Framework** | Express.js | 4.18.2 | REST API server |
| **Database** | MongoDB Atlas | 7.x | Cloud NoSQL database |
| **ODM** | Mongoose | 7.3.1 | Data modeling & connection pooling |
| **Authentication** | jsonwebtoken | 9.0.0 | Stateless JWT auth |
| **Password Security** | bcryptjs | 2.4.3 | Salted password hashing |
| **Rate Limiting** | express-rate-limit | 8.7.1 | DDoS & brute-force defense |
| **Security Headers** | helmet | 7.0.0 | CSP, HSTS, X-Frame headers |
| **Compression** | compression | 1.8.2 | Response payload reduction |
| **Validation** | express-validator | 7.0.1 | Strict schema validation |
| **Process Management**| PM2 & Docker | - | Clustering & containerization |

---

## Directory Structure

```text
gallery_management_system(backend)/
├── server.js                 # Production Express entry point (Graceful shutdown, healthcheck)
├── package.json              # Dependencies & deployment scripts
├── Dockerfile                # Multi-stage optimized Node.js Alpine image
├── docker-compose.yml        # Container orchestration
├── ecosystem.config.js       # PM2 cluster configuration
├── .dockerignore             # Docker build ignores
├── .env.example              # Documented environment template
├── .env                      # Local environment configuration
│
├── config/
│   ├── db.js                 # Resilient MongoDB connection with pooling & event listeners
│   └── validateEnv.js        # Startup environment variable validation
│
├── middleware/
│   ├── verifyToken.js        # JWT bearer authentication
│   ├── authorizeRole.js      # Role-based access control
│   ├── rateLimiter.js        # General & Auth rate limiters
│   ├── sanitizeInput.js      # NoSQL injection sanitizer
│   ├── validateRequest.js    # Express-validator error handler
│   └── errorHandler.js       # Centralized production error handler
│
├── validators/
│   ├── authValidator.js      # Register & login validation
│   ├── artistValidator.js    # Artist endpoints validation
│   ├── artworkValidator.js   # Artwork endpoints & query param validation
│   ├── categoryValidator.js  # Category endpoints validation
│   └── exhibitionValidator.js# Exhibition endpoints & date validation
│
├── models/
│   ├── User.js               # User schema with bcrypt hooks
│   ├── Artist.js             # Artist schema with indexed name
│   ├── Artwork.js            # Artwork schema with compound indexes
│   ├── Category.js           # Category schema with unique name
│   └── Exhibition.js         # Exhibition schema with date indexes
│
├── controllers/
│   ├── authController.js     # Protected registration & login
│   ├── artistController.js   # Artist CRUD handlers
│   ├── artworkController.js  # Artwork pagination, filter, search
│   ├── categoryController.js # Category management
│   └── exhibitionController.js # Exhibition management & populates
│
└── routes/
    ├── authRoutes.js         # /api/auth
    ├── artistRoutes.js       # /api/artists
    ├── artworkRoutes.js      # /api/artworks
    ├── categoryRoutes.js     # /api/categories
    └── exhibitionRoutes.js   # /api/exhibitions
```

---

## Database Schema & Indexes

To ensure high throughput and query performance under production load:

- **Artwork Collection**:
  - `{ title: 1 }`: Fast keyword lookups
  - `{ category: 1, createdAt: -1 }`: Compound index for category filtering and reverse-chronological sorting
  - `{ artistId: 1, createdAt: -1 }`: Compound index for artist portfolio listings
- **Artist Collection**:
  - `{ userId: 1 }` (unique): One-to-one artist profile mapping
  - `{ artistName: 1 }`: Indexed artist name search
- **Exhibition Collection**:
  - `{ startDate: 1, endDate: 1 }`: Compound index for active/upcoming exhibition date queries
- **User Collection**:
  - `{ email: 1 }` (unique): Fast credential lookups

---

## Production Security & Hardening

1. **Role Escalation Protection**:
   Public registration (`POST /api/auth/register`) strictly defaults to `user` or `artist`. Supplying `role: "admin"` requires the `ADMIN_REGISTRATION_SECRET` or an authenticated administrator's token.
2. **Brute-Force Rate Limiting**:
   `/api/auth/*` routes are guarded by a dedicated `authLimiter` allowing max 15 requests per 15 minutes per IP.
3. **NoSQL Injection Sanitization**:
   All incoming keys matching `$` or containing `.` are stripped out before reaching Mongoose queries.
4. **Information Disclosure Prevention**:
   In production (`NODE_ENV=production`), error stack traces and internal database exceptions are never leaked to clients.
5. **Payload Size Guard**:
   JSON request payloads are capped at `10kb` to prevent memory exhaustion attacks.

---

## Setup & Deployment Instructions

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```bash
   cp .env.example .env
   ```
3. Start in development mode (with nodemon):
   ```bash
   npm run dev
   ```

### Docker Deployment

To build and run the production Docker container:

```bash
# Build the container image
docker build -t gallery-backend .

# Run container with environment configuration
docker run -d -p 5000:5000 --env-file .env --name gallery-api gallery-backend
```

Or using Docker Compose:
```bash
docker-compose up -d --build
```

### PM2 Cluster Deployment (Bare Metal / VM)

To deploy across all CPU cores with automatic restart and log rotation:

```bash
# Install PM2 globally
npm install -g pm2

# Start cluster mode
npm run pm2:start

# Check cluster logs and monitoring
npm run pm2:logs
pm2 monit
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Express server port |
| `NODE_ENV` | No | `development` | Environment mode (`development` or `production`) |
| `MONGO_URI` | **Yes** | - | MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | - | 256-bit secret key for JWT signing |
| `JWT_EXPIRES_IN` | No | `7d` | Token expiration duration |
| `CORS_ORIGIN` | No | `*` | Allowed CORS origins (e.g. `https://myfrontend.com`) |
| `ADMIN_REGISTRATION_SECRET` | No | - | Passphrase required to register admin accounts |

---

## API Documentation & Health Monitoring

### Health & Monitoring Endpoints

- `GET /health` or `GET /api/health`
  - Returns `200 OK` when healthy, or `503 Service Unavailable` when degraded.
  - Response:
    ```json
    {
      "status": "ok",
      "uptime": "1420s",
      "timestamp": "2026-10-23T06:00:00.000Z",
      "environment": "production",
      "database": { "status": "connected" },
      "memory": { "rss": "72.50 MB", "heapUsed": "24.10 MB" }
    }
    ```
- `GET /api`
  - Root API summary and status.

### Core Resource Endpoints

- **Auth**:
  - `POST /api/auth/register` (rate-limited, validated)
  - `POST /api/auth/login` (rate-limited, validated)
- **Categories**:
  - `GET /api/categories`
  - `POST /api/categories` (Admin required)
  - `PUT /api/categories/:id` (Admin required)
  - `DELETE /api/categories/:id` (Admin required)
- **Artists**:
  - `GET /api/artists`
  - `GET /api/artists/:id`
  - `POST /api/artists` (Admin/Artist)
  - `PUT /api/artists/:id` (Admin/Artist)
  - `DELETE /api/artists/:id` (Admin)
- **Artworks**:
  - `GET /api/artworks?page=1&limit=10&search=keyword&category=id`
  - `GET /api/artworks/:id`
  - `POST /api/artworks` (Admin/Artist)
  - `PUT /api/artworks/:id` (Admin/Artist)
  - `DELETE /api/artworks/:id` (Admin)
- **Exhibitions**:
  - `GET /api/exhibitions`
  - `POST /api/exhibitions` (Admin)
  - `PUT /api/exhibitions/:id` (Admin)
  - `DELETE /api/exhibitions/:id` (Admin)

---

## Error Handling & Resilience

The API returns consistent error payloads matching this format:

```json
{
  "success": false,
  "message": "Human-readable description of error",
  "errors": [
    { "field": "title", "message": "Title is required." }
  ]
}
```

| HTTP Status | Meaning |
|-------------|---------|
| `200` | Successful request |
| `201` | Resource successfully created |
| `400` | Validation failure or malformed ObjectId |
| `401` | Missing, malformed, or expired JWT |
| `403` | Forbidden / unauthorized role privilege |
| `404` | Resource or route not found |
| `409` | Conflict (e.g. duplicate email or category name) |
| `429` | Rate limit exceeded |
| `500` | Internal server error (masked in production) |
| `503` | Database temporarily degraded or unavailable |
