# 🚀 3W Business Private Limited — TaskPlanet Mini Social Post Application

A full-stack Mini Social Post Application inspired strongly by the **TaskPlanet Mobile Social Page**, built for the **3W Business Private Limited Full Stack Internship Round 1 Assignment**.

---

## 🌟 Tech Stack

- **Frontend**: React.js, React Router, Axios, Vanilla CSS with CSS Variables, MUI / Lucide Icons *(Strictly NO TailwindCSS)*.
- **Backend**: Node.js, Express.js, JWT, bcrypt.js.
- **Database**: **MongoDB Atlas** (using Mongoose ODM).

---

## 🏛️ Database Architecture Rule

The application enforces **strictly ONLY TWO MongoDB collections**:

1. **`users`**: Stores user profiles, hashed passwords, avatars, and points.
2. **`posts`**: Stores user posts with embedded `likes` and `comments` arrays.

> **MongoDB Atlas is the production database.**
> In-memory fallbacks are disabled in production to guarantee 100% MongoDB database persistence.

---

## 📋 Required API Endpoints

### 🔐 Authentication
- `POST /api/auth/signup` — Register new user *(with `/register` alias)*
- `POST /api/auth/login` — Authenticate email/username + password, returns JWT token
- `GET /api/auth/me` — Fetch authenticated profile

### 📝 Posts & Feed
- `GET /api/posts?page=1&limit=5` — Public post timeline (newest first)
- `POST /api/posts` — Create text, image, or text + image post
- `POST /api/posts/:id/like` — Toggle like / unlike on a post
- `POST /api/posts/:id/comment` — Add embedded comment to a post

---

## ⚙️ Environment Variables Setup

Create a `.env` file inside `/backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_secure_random_secret_here
CLIENT_URL=http://localhost:3000
```

Create a `.env` file inside `/frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Running Locally

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000/social` in your browser.

---

## 🌐 Production Deployment Guide

- **Database**: Host database on **MongoDB Atlas**.
- **Backend Service**: Deploy backend to **Render** (set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`).
- **Frontend Service**: Deploy frontend to **Vercel** (set `VITE_API_URL`).
