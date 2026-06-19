# Digital Art Gallery Management System

> A production-ready, backend-only REST API for managing a digital art gallery — including artists, artworks, categories, and exhibitions — with JWT authentication and role-based access control.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6%2B-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

---

## Features

- **JWT Authentication** — Secure register/login with hashed passwords (bcryptjs, saltRounds: 10)
- **Role-Based Access Control** — Three roles: `admin`, `artist`, `user` with per-route authorization
- **Artist Profiles** — One-to-one artist profile linked to a user account
- **Artwork Catalogue** — Full CRUD with pagination, case-insensitive title search, and category filtering
- **Category Management** — Admin-managed artwork categories with uniqueness enforcement
- **Exhibition Management** — Admin-curated exhibitions referencing multiple artworks with date validation
- **Global Error Handling** — Centralized error handler for Mongoose errors, JWT errors, and duplicates
- **Input Validation** — express-validator on all write endpoints
- **Security** — helmet (security headers), cors, no password leakage in any response
- **Developer Experience** — morgan request logging, nodemon auto-restart, structured JSON responses

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) v6 or higher

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/digital-art-gallery-management-system.git
   ```

2. **Navigate into the project**
   ```bash
   cd digital-art-gallery-management-system
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

5. **Open `.env` and configure your values**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/digital_art_gallery
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

---

## Environment Setup

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/digital_art_gallery` |
| `JWT_SECRET` | Secret for signing tokens | *(required)* |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `NODE_ENV` | Environment (`development`/`production`) | `development` |

---

## Starting MongoDB Locally

**macOS / Linux:**
```bash
mongod --dbpath /data/db
```

**Windows:**
```powershell
mongod --dbpath "C:\data\db"
```

**Using mongosh to verify connection:**
```bash
mongosh
```

---

## Starting the Server

```bash
# Development mode (auto-restart on file changes)
npm run dev

# Production mode
npm start
```

Expected output:
```
MongoDB Connected: localhost
Server running on port 5000
```

---

## Quick API Reference

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | — | Register new user |
| POST | `/api/auth/login` | No | — | Login, get JWT |
| POST | `/api/artists` | Yes | admin/artist | Create artist profile |
| GET | `/api/artists` | Yes | any | List all artists |
| GET | `/api/artists/:id` | Yes | any | Get artist by ID |
| PUT | `/api/artists/:id` | Yes | admin/artist | Update artist |
| DELETE | `/api/artists/:id` | Yes | admin | Delete artist |
| POST | `/api/artworks` | Yes | admin/artist | Create artwork |
| GET | `/api/artworks` | Yes | any | List artworks (paginated) |
| GET | `/api/artworks/:id` | Yes | any | Get artwork by ID |
| PUT | `/api/artworks/:id` | Yes | admin/artist | Update artwork |
| DELETE | `/api/artworks/:id` | Yes | admin | Delete artwork |
| POST | `/api/categories` | Yes | admin | Create category |
| GET | `/api/categories` | Yes | any | List all categories |
| PUT | `/api/categories/:id` | Yes | admin | Update category |
| DELETE | `/api/categories/:id` | Yes | admin | Delete category |
| POST | `/api/exhibitions` | Yes | admin | Create exhibition |
| GET | `/api/exhibitions` | Yes | any | List all exhibitions |
| PUT | `/api/exhibitions/:id` | Yes | admin | Update exhibition |
| DELETE | `/api/exhibitions/:id` | Yes | admin | Delete exhibition |

---

## Authentication

Include the JWT in the `Authorization` header of all protected requests:

```
Authorization: Bearer <your_token_here>
```

---

## Artwork Query Parameters

```
GET /api/artworks?page=1&limit=10&search=sunset&category=<categoryId>
```

| Param | Type | Description |
|---|---|---|
| `page` | Integer | Page number (default: 1) |
| `limit` | Integer | Items per page (default: 10) |
| `search` | String | Case-insensitive title search |
| `category` | ObjectId | Filter by category ID |

---

## Default Test Credentials

After running `npm run dev`, register an admin user via:

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

> **Note:** The `role` field is accepted during registration for testing convenience. In production, you should restrict this field and assign roles through a separate admin mechanism.

---

## Postman Collection

Import `postman/collection.json` into Postman to get all pre-configured requests. After logging in, the Login request automatically saves your token to the `token` collection variable.

---

## Full Documentation

See [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) for:
- Detailed request/response examples for every endpoint
- Error response formats
- HTTP status code reference
- Query parameter guide

---

## License

MIT © 2025 Digital Art Gallery Management System
