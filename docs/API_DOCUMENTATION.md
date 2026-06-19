# Digital Art Gallery Management System — API Documentation

## 1. Project Overview

The **Digital Art Gallery Management System** is a production-ready RESTful API built with **Node.js** and **Express**. It enables a digital art gallery to manage artists, artworks, categories, and exhibitions with full role-based access control.

### What It Does

- **User Authentication** — Secure JWT-based register and login with hashed passwords.
- **Artist Profiles** — Artists create and manage their profiles tied to user accounts.
- **Artwork Catalogue** — Full CRUD for artworks with pagination, search, and category filtering.
- **Category Management** — Admins maintain artwork categories.
- **Exhibition Management** — Admins curate exhibitions composed of multiple artworks.

### Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v18+ |
| Web Framework | Express v4 |
| Database ODM | Mongoose v7 |
| Authentication | JSON Web Tokens (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Input Validation | express-validator |
| Security Headers | helmet |
| CORS | cors |
| HTTP Logging | morgan |
| Environment Config | dotenv |

---

## 2. Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** v6 or higher (local or Atlas)

---

## 3. Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/digital-art-gallery-management-system.git

# 2. Navigate into the project directory
cd digital-art-gallery-management-system

# 3. Install all dependencies
npm install

# 4. Copy the example environment file
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/digital_art_gallery
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

```bash
# 5. Start MongoDB (if running locally)
mongod --dbpath /data/db

# 6. Start the development server
npm run dev
```

You should see:

```
MongoDB Connected: localhost
Server running on port 5000
```

---

## 4. Folder Structure

```
project-root/
├── config/
│   └── db.js                 # MongoDB connection logic
├── controllers/
│   ├── authController.js     # Register and login handlers
│   ├── artistController.js   # Artist CRUD handlers
│   ├── artworkController.js  # Artwork CRUD with search/filter/pagination
│   ├── categoryController.js # Category CRUD handlers
│   └── exhibitionController.js # Exhibition CRUD handlers
├── middleware/
│   ├── verifyToken.js        # JWT extraction and verification
│   ├── authorizeRole.js      # Role-based access control factory
│   ├── errorHandler.js       # Global error handler
│   └── validateRequest.js    # express-validator result checker
├── models/
│   ├── User.js               # User schema with bcrypt hooks
│   ├── Artist.js             # Artist schema
│   ├── Artwork.js            # Artwork schema
│   ├── Category.js           # Category schema
│   └── Exhibition.js         # Exhibition schema with date validator
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   ├── artistRoutes.js       # /api/artists routes
│   ├── artworkRoutes.js      # /api/artworks routes
│   ├── categoryRoutes.js     # /api/categories routes
│   └── exhibitionRoutes.js   # /api/exhibitions routes
├── docs/
│   └── API_DOCUMENTATION.md  # This file
├── postman/
│   └── collection.json       # Postman Collection v2.1
├── .env.example              # Example environment variables
├── .gitignore
├── package.json
├── server.js                 # Application entry point
└── README.md
```

---

## 5. Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/digital_art_gallery` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_super_secret_key` |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `NODE_ENV` | Application environment | `development` or `production` |

> **Important:** Never commit your actual `.env` file. Only `.env.example` should be tracked by git.

---

## 6. Authentication

This API uses **JWT Bearer Token** authentication.

### How It Works

1. Register or login via `/api/auth/register` or `/api/auth/login`.
2. On success, you receive a `token` in the response.
3. Include the token in the `Authorization` header for all protected routes:

```
Authorization: Bearer <your_token_here>
```

### Roles

| Role | Permissions |
|---|---|
| `admin` | Full access to all resources |
| `artist` | Can create/update their own artist profile and artworks |
| `user` | Read-only access to publicly listed resources |

---

## 7. API Endpoints Reference

### Authentication

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | Any | Register a new user |
| POST | `/api/auth/login` | No | Any | Login and receive JWT |

### Artists

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| POST | `/api/artists` | Yes | admin, artist | Create artist profile |
| GET | `/api/artists` | Yes | Any | Get all artists |
| GET | `/api/artists/:id` | Yes | Any | Get artist by ID |
| PUT | `/api/artists/:id` | Yes | admin, artist | Update artist (owner or admin) |
| DELETE | `/api/artists/:id` | Yes | admin | Delete artist |

### Artworks

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| POST | `/api/artworks` | Yes | admin, artist | Create artwork |
| GET | `/api/artworks` | Yes | Any | Get all artworks (paginated) |
| GET | `/api/artworks/:id` | Yes | Any | Get artwork by ID |
| PUT | `/api/artworks/:id` | Yes | admin, artist | Update artwork (owner or admin) |
| DELETE | `/api/artworks/:id` | Yes | admin | Delete artwork |

### Categories

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| POST | `/api/categories` | Yes | admin | Create category |
| GET | `/api/categories` | Yes | Any | Get all categories |
| PUT | `/api/categories/:id` | Yes | admin | Update category |
| DELETE | `/api/categories/:id` | Yes | admin | Delete category |

### Exhibitions

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| POST | `/api/exhibitions` | Yes | admin | Create exhibition |
| GET | `/api/exhibitions` | Yes | Any | Get all exhibitions |
| PUT | `/api/exhibitions/:id` | Yes | admin | Update exhibition |
| DELETE | `/api/exhibitions/:id` | Yes | admin | Delete exhibition |

---

## 8. Request & Response Examples

### POST /api/auth/register

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@gallery.com",
  "password": "admin123",
  "role": "admin"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64a1b2c3d4e5f6789abc1234",
      "name": "Admin User",
      "email": "admin@gallery.com",
      "role": "admin",
      "createdAt": "2025-08-01T10:00:00.000Z"
    }
  }
}
```

**Error Response (409 — Duplicate Email):**
```json
{
  "success": false,
  "message": "A user with this email already exists."
}
```

---

### POST /api/auth/login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gallery.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64a1b2c3d4e5f6789abc1234",
      "name": "Admin User",
      "email": "admin@gallery.com",
      "role": "admin",
      "createdAt": "2025-08-01T10:00:00.000Z"
    }
  }
}
```

**Error Response (401 — Invalid Credentials):**
```json
{
  "success": false,
  "message": "Invalid credentials."
}
```

---

### POST /api/categories

**Request:**
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoryName": "Digital Art",
  "description": "Artwork created using digital tools such as Photoshop or Illustrator."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully.",
  "data": {
    "category": {
      "_id": "64b2c3d4e5f6789abc2345",
      "categoryName": "Digital Art",
      "description": "Artwork created using digital tools such as Photoshop or Illustrator.",
      "createdAt": "2025-08-01T10:05:00.000Z",
      "updatedAt": "2025-08-01T10:05:00.000Z"
    }
  }
}
```

---

### POST /api/artists

**Request:**
```http
POST /api/artists
Authorization: Bearer <token>
Content-Type: application/json

{
  "artistName": "Leonardo DiVinci",
  "specialization": "Digital Painting",
  "bio": "A passionate digital artist with over 10 years of experience."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Artist profile created successfully.",
  "data": {
    "artist": {
      "_id": "64c3d4e5f6789abc3456",
      "artistName": "Leonardo DiVinci",
      "specialization": "Digital Painting",
      "bio": "A passionate digital artist with over 10 years of experience.",
      "userId": {
        "_id": "64a1b2c3d4e5f6789abc1234",
        "name": "Admin User",
        "email": "admin@gallery.com",
        "role": "admin"
      },
      "createdAt": "2025-08-01T10:10:00.000Z"
    }
  }
}
```

---

### POST /api/artworks

**Request:**
```http
POST /api/artworks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Sunset Dreams",
  "description": "A vibrant sunset painting capturing the golden hues of twilight over the ocean.",
  "price": 1500,
  "category": "64b2c3d4e5f6789abc2345",
  "artistId": "64c3d4e5f6789abc3456"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Artwork created successfully.",
  "data": {
    "artwork": {
      "_id": "64d4e5f6789abc4567",
      "title": "Sunset Dreams",
      "description": "A vibrant sunset painting capturing the golden hues of twilight over the ocean.",
      "price": 1500,
      "artistId": {
        "_id": "64c3d4e5f6789abc3456",
        "artistName": "Leonardo DiVinci",
        "specialization": "Digital Painting"
      },
      "category": {
        "_id": "64b2c3d4e5f6789abc2345",
        "categoryName": "Digital Art",
        "description": "Artwork created using digital tools."
      },
      "createdAt": "2025-08-01T10:15:00.000Z"
    }
  }
}
```

---

### GET /api/artworks (Paginated)

**Request:**
```http
GET /api/artworks?page=1&limit=10
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Artworks retrieved successfully.",
  "data": {
    "artworks": [
      {
        "_id": "64d4e5f6789abc4567",
        "title": "Sunset Dreams",
        "price": 1500,
        "artistId": {
          "_id": "64c3d4e5f6789abc3456",
          "artistName": "Leonardo DiVinci",
          "specialization": "Digital Painting"
        },
        "category": {
          "_id": "64b2c3d4e5f6789abc2345",
          "categoryName": "Digital Art"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### POST /api/exhibitions

**Request:**
```http
POST /api/exhibitions
Authorization: Bearer <token>
Content-Type: application/json

{
  "exhibitionName": "Modern Digital Era",
  "startDate": "2025-08-01",
  "endDate": "2025-08-31",
  "artworkIds": ["64d4e5f6789abc4567"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Exhibition created successfully.",
  "data": {
    "exhibition": {
      "_id": "64e5f6789abc5678",
      "exhibitionName": "Modern Digital Era",
      "startDate": "2025-08-01T00:00:00.000Z",
      "endDate": "2025-08-31T00:00:00.000Z",
      "artworkIds": [
        {
          "_id": "64d4e5f6789abc4567",
          "title": "Sunset Dreams",
          "price": 1500,
          "artistId": {
            "artistName": "Leonardo DiVinci"
          }
        }
      ],
      "createdAt": "2025-08-01T10:20:00.000Z"
    }
  }
}
```

---

## 9. Query Parameters (Artworks)

The `GET /api/artworks` endpoint supports the following query parameters:

| Parameter | Type | Description | Example |
|---|---|---|---|
| `page` | Integer | Page number (default: 1) | `?page=2` |
| `limit` | Integer | Results per page (default: 10) | `?limit=5` |
| `search` | String | Case-insensitive title search | `?search=sunset` |
| `category` | ObjectId | Filter by category ID | `?category=64b2c3...` |

**Example URLs:**

```
# Get page 2, 5 items per page
GET /api/artworks?page=2&limit=5

# Search artworks containing "dream" in the title
GET /api/artworks?search=dream

# Filter by category AND search
GET /api/artworks?category=64b2c3d4e5f6789abc2345&search=sunset

# All filters combined
GET /api/artworks?page=1&limit=10&search=sunset&category=64b2c3d4e5f6789abc2345
```

---

## 10. HTTP Status Codes Used

| Code | Meaning | When Used |
|---|---|---|
| `200` | OK | Successful GET, PUT, DELETE operations |
| `201` | Created | Successful resource creation (POST) |
| `400` | Bad Request | Validation errors, invalid ObjectId, malformed data |
| `401` | Unauthorized | Missing/invalid/expired JWT token |
| `403` | Forbidden | Authenticated but insufficient role/ownership |
| `404` | Not Found | Requested resource does not exist |
| `409` | Conflict | Duplicate email, duplicate artist profile, duplicate category name |
| `500` | Internal Server Error | Unhandled server-side errors |

---

## 11. Error Response Format

All error responses follow this standard structure:

```json
{
  "success": false,
  "message": "Human-readable error description.",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address."
    }
  ],
  "stack": "Error stack trace (only in development mode)"
}
```

- **`success`** — Always `false` for errors.
- **`message`** — A descriptive error message.
- **`errors`** — An array of field-level validation errors (only present for validation failures).
- **`stack`** — Stack trace (only included when `NODE_ENV=development`).

### Validation Error Example (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address." },
    { "field": "password", "message": "Password must be at least 6 characters." }
  ]
}
```

### Unauthorized Example (401)

```json
{
  "success": false,
  "message": "Access denied. No token provided or malformed Authorization header."
}
```

### Forbidden Example (403)

```json
{
  "success": false,
  "message": "Access denied. You do not have permission to perform this action."
}
```

### Not Found Example (404)

```json
{
  "success": false,
  "message": "Artwork not found."
}
```

### Conflict Example (409)

```json
{
  "success": false,
  "message": "Duplicate value for field 'email'. A record with this email already exists."
}
```
