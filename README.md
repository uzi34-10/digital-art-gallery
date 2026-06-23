# Digital Art Gallery Management System

A comprehensive, production-ready Node.js REST API backend for managing a Digital Art Gallery. This project implements secure user authentication with JWT tokens, role-based authorization (Admin/User), password encryption, and a complete gallery management system.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [Validation Rules](#validation-rules)
- [Error Handling](#error-handling)
- [Challenges & Solutions](#challenges--solutions)

---

## Project Overview

**Digital Art Gallery Management System** is a robust REST API designed to efficiently manage artists, art collections, categories, and exhibitions. 

### Key Features
✅ **Secure User Authentication**: Registration and login using JWT tokens.  
✅ **Role-Based Access Control**: Strict access control separating regular users and Administrators.  
✅ **Password Security**: Password hashing using bcryptjs.  
✅ **Input Validation**: Comprehensive request validation using express-validator.  
✅ **Advanced Querying**: Built-in pagination, keyword searching, and filtering on Artworks.  
✅ **MongoDB Integration**: Seamless connection via Mongoose with reference mapping and pre-save hooks.  
✅ **Security Enhancements**: Implements security headers with Helmet and CORS management.  

---

## Architecture

### MVC Architecture Pattern

```text
User Request
    ↓
Route (HTTP Method + Path)
    ↓
Middleware (Validation, JWT Auth, Role Auth)
    ↓
Controller (Business Logic)
    ↓
Model (Database Query & Mongoose Validation)
    ↓
MongoDB Atlas Database
    ↓
Response (JSON)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB Atlas |
| **ODM** | Mongoose |
| **Authentication** | jsonwebtoken (JWT) |
| **Password Security** | bcryptjs |
| **Input Validation** | express-validator |
| **Security Headers** | helmet, cors |
| **Request Logging** | morgan |
| **Dev Tool** | nodemon |

---

## Directory Structure

```text
gallery_management_system(backend)/
├── server.js                 # Express app entry point
├── package.json              # Project dependencies
├── .env                      # Environment variables
│
├── config/
│   └── db.js                 # MongoDB connection setup
│
├── models/                   # Mongoose schemas
│   ├── User.js               # User schema (roles, passwords)
│   ├── Artist.js             # Artist profiles
│   ├── Artwork.js            # Artworks with refs to Artist/Category
│   ├── Category.js           # Art categories
│   └── Exhibition.js         # Exhibitions featuring Artworks
│
├── controllers/              # Business logic handlers
│   ├── authController.js     # Login & Registration
│   ├── artistController.js   # Artist management
│   ├── artworkController.js  # Artwork management (with search)
│   ├── categoryController.js # Category management
│   └── exhibitionController.js # Exhibition management
│
├── routes/                   # API route definitions
│   ├── authRoutes.js         # /api/auth endpoints
│   ├── artistRoutes.js       # /api/artists endpoints
│   ├── artworkRoutes.js      # /api/artworks endpoints
│   ├── categoryRoutes.js     # /api/categories endpoints
│   └── exhibitionRoutes.js   # /api/exhibitions endpoints
│
├── middlewares/              # Custom middleware
│   ├── authMiddleware.js     # verifyToken & authorizeRole
│   ├── validateRequest.js    # express-validator error handler
│   └── errorHandler.js       # Global error handler
│
└── postman/
    └── collection.json       # Pre-configured Postman requests
```

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Artwork Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  artist: ObjectId (reference to Artist),
  category: ObjectId (reference to Category),
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

*(Additional schemas exist for Artists, Categories, and Exhibitions following the same relational pattern.)*

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas Account (or local MongoDB)

### Step 1: Clone or Open Repository
Navigate to the project root directory in your terminal.

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory and add your connection strings (see section below).

### Step 4: Start the Server
```bash
npm run dev
```

Expected output:
```text
[nodemon] starting `node server.js`
Server running on port 5000
MongoDB Connected: ac-wym8zvm-shard-00-00.ks8r6iw.mongodb.net
```

---

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://username:password@shard.mongodb.net:27017/gallery?ssl=true&replicaSet=atlas-g05oll-shard-0&authSource=admin&retryWrites=true&w=majority
JWT_SECRET=your_very_strong_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## API Documentation

### Base URL: `http://localhost:5000/api`

### 1. Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive a JWT token

### 2. Categories
- `POST /categories` - Create a category **(Requires Admin token)**
- `GET /categories` - Retrieve all categories

### 3. Artists
- `POST /artists` - Create an artist **(Requires Admin token)**
- `GET /artists` - Retrieve all artists

### 4. Artworks
- `POST /artworks` - Create an artwork **(Requires Admin token)**
- `GET /artworks` - Retrieve all artworks
  - Supports query parameters: `?page=1&limit=10&search=sunset&category=<categoryId>`

### 5. Exhibitions
- `POST /exhibitions` - Create an exhibition
- `GET /exhibitions` - Retrieve all exhibitions

---

## Authentication & Authorization

### Middleware: `verifyToken`
Located in `middlewares/authMiddleware.js`, this protects routes by:
1. Extracting the `Authorization: Bearer <token>` header.
2. Verifying the JWT signature against the `JWT_SECRET`.
3. Attaching the decoded user payload to `req.user`.
4. Rejecting invalid, missing, or expired tokens with a `401 Unauthorized` status.

### Middleware: `authorizeRole`
Protects sensitive routes (e.g., creating categories) by:
1. Checking if `req.user.role` matches the permitted roles (e.g., `admin`).
2. Rejecting the request with a `403 Forbidden` status if the user lacks the proper role.

---

## Validation Rules

Requests are strictly validated using `express-validator`.

**Example: User Registration Validation**
- `email`: Must be a valid email format.
- `password`: Must be a minimum of 6 characters long.
- `name`: Cannot be empty.
- `role`: Must be either 'user' or 'admin'.

If validation fails, the API responds with a `400 Bad Request` and an array detailing the exact validation errors.

---

## Error Handling

The application implements a centralized error handling middleware (`errorHandler.js`) to provide consistent API responses.

| Code | Meaning | Example Scenario |
|------|---------|------------------|
| **200** | OK | Successful GET request or Login |
| **201** | Created | Successfully created a new database document |
| **400** | Bad Request | Validation failure or invalid Object IDs |
| **401** | Unauthorized | Missing or invalid JWT Token |
| **403** | Forbidden | Valid token but insufficient role privileges (Not an Admin) |
| **404** | Not Found | Requested endpoint or database resource doesn't exist |
| **500** | Server Error | Unhandled backend exception |

---

## Challenges & Solutions

During development, complex networking issues were resolved to ensure seamless connection to MongoDB Atlas:

1. **SRV DNS Resolution Failure (`ECONNREFUSED`)**
   - **Cause**: Network VPN/DNS actively blocked the `_mongodb._tcp` SRV lookup.
   - **Solution**: Bypassed SRV lookup by converting the connection string to a direct `mongodb://` URI with hardcoded node hostnames.

2. **Replica Set Authentication**
   - **Cause**: The direct URI strictly requires the correct replica set name, which is normally handled automatically by SRV.
   - **Solution**: Manually queried the cluster's DNS TXT record via Google DNS (`Resolve-DnsName -Server 8.8.8.8`) to extract the exact replica set name (`atlas-g05oll-shard-0`).

3. **Connection Reset (`ECONNRESET`)**
   - **Cause**: The Atlas free-tier (M0) cluster automatically paused due to inactivity, causing successful TCP connections to be immediately dropped.
   - **Solution**: Resumed the cluster directly via the MongoDB Atlas web dashboard.

4. **IP Whitelisting Restrictions**
   - **Cause**: VPN IP addresses were being rejected by MongoDB Atlas network filters.
   - **Solution**: Explicitly allowed access from anywhere (`0.0.0.0/0`) within the Atlas Network Access panel.

---

## Author
Developed as a production-ready, highly secure API backend for digital art management.
