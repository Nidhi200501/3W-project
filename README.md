# 3W Mini Social Post Application

Full-stack social post web application built for the **3W Business Private Limited Internship Assignment Task 1**.

Inspired by the **TaskPlanet Social Page**, faithfully reproducing its dark navy/neon blue theme, visual layout, header stats, search functionality, feed filters, spotlight card, post creator, like & comment interactions, user level badges, and bottom navigation bar.

---

## 📱 Features

- **Signup & Login**: User registration and login using email/username and password.
- **JWT Authentication**: Secure authentication stored in `localStorage`.
- **Create Post**: Support for creating text posts, image posts (URL / local base64 upload), or BOTH (neither field is mandatory).
- **Public Timeline Feed**: Displays all posts from all users in reverse chronological order (newest first).
- **Like & Comment System**:
  - Toggle like/unlike with instant count update.
  - Interactive **"Liked By" Modal** displaying likers' names & usernames.
  - Interactive **Comment Drawer** displaying commenter's name, avatar, time, and text.
- **Embedded Likes & Comments**: Strictly **only two MongoDB collections** (`users` and `posts`).
- **Pagination**: Efficient server-side pagination (`GET /api/posts?page=1&limit=5`) with `Previous` and `Next` controls.
- **TaskPlanet Social UI**: Recreates header stats (`100 ⭐`, `₹0.00`), search box, create post card, filter pills, spotlight card, promote banner, floating `+` button, and sticky bottom navigation bar.
- **Bright & Dark Mode**: Theme toggle switch allowing instant switching between Dark Navy and Clean Light themes.
- **Responsive Layout**: Mobile-first design optimized for mobile phones, tablets, and desktop displays.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS (Strictly NO TailwindCSS)

### Backend
- **Runtime**: Node.js & Express.js
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS
- **ODM**: Mongoose

### Database
- **Database**: MongoDB (Atlas in production / Local or In-Memory fallback in development)

---

## 📁 Project Structure

```
3w assignment/
├── backend/
│   ├── config/
│   │   ├── db.js             # MongoDB connection setup
│   │   └── memoryStore.js    # Self-contained fallback data store
│   ├── controllers/
│   │   ├── authController.js # Register, Login & User profile logic
│   │   └── postController.js # Feed, Pagination, Create Post, Likes & Comments
│   ├── middleware/
│   │   └── authMiddleware.js # JWT protection middleware
│   ├── models/
│   │   ├── User.js           # Collection 1: Users schema
│   │   └── Post.js           # Collection 2: Posts schema (embedded likes/comments)
│   ├── routes/
│   │   ├── authRoutes.js     # Auth API endpoints
│   │   ├── auth.js           # Auth API alias endpoints
│   │   ├── postRoutes.js     # Post API endpoints
│   │   └── posts.js          # Post API alias endpoints
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js             # Express API server entry
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavbarHeader.jsx   # Top Header with stats & theme toggle
│   │   │   ├── SearchBar.jsx      # Search box with glowing blue button
│   │   │   ├── CreatePostCard.jsx # Post creator (text, image, triggers)
│   │   │   ├── FeedFilters.jsx    # Horizontal scroll filter pills
│   │   │   ├── PostCard.jsx       # Feed post item (like toggle, comment drawer)
│   │   │   ├── LikedUsersModal.jsx# Modal displaying likers' usernames
│   │   │   ├── Pagination.jsx     # Previous / Next pagination controls
│   │   │   ├── SpotlightCard.jsx  # TaskPlanet Spotlight banner
│   │   │   ├── PromoteCard.jsx    # Platform promotion callout
│   │   │   ├── FloatingButton.jsx # Floating + action button
│   │   │   ├── BottomNav.jsx      # Sticky 5-item bottom bar
│   │   │   └── AuthModal.jsx      # Login / Signup modal
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Front Welcome Hub page
│   │   │   ├── Feed.jsx           # TaskPlanet Social Feed page
│   │   │   ├── Login.jsx          # Dedicated Login page
│   │   │   └── Signup.jsx         # Dedicated Register page
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state & axios base URL config
│   │   ├── App.jsx
│   │   ├── index.css              # Dark/Light CSS design system
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port `27017` or a MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm start
```
*Backend API server will run at `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
*Frontend web application will run at `http://localhost:3000`*

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskplanet_social
JWT_SECRET=taskplanet_super_secret_jwt_key_2026_3w
CLIENT_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` (or `/api/auth/signup`) - Register a new user (`name`, `username`, `email`, `password`)
- `POST /api/auth/login` - Authenticate user (`loginIdentifier`, `password`)
- `GET /api/auth/me` - Get current logged-in user profile (Requires Bearer token)

### Posts Feed
- `GET /api/posts?page=1&limit=5` - Fetch public posts timeline with pagination metadata (`currentPage`, `totalPages`, `totalPosts`, `hasNextPage`, `hasPrevPage`)
- `POST /api/posts` - Create post (`text`, `image`) (Requires Bearer token)
- `POST /api/posts/:id/like` - Toggle like/unlike (Requires Bearer token)
- `POST /api/posts/:id/comment` - Add comment (`text`) (Requires Bearer token)

---

## 🌐 Deployment Configuration

This repository is production-ready for deployment:
- **Frontend**: Deploy `frontend` directory to **Vercel** or **Netlify** (Build Command: `npm run build`, Output Directory: `dist`). Set `VITE_API_URL` environment variable to your deployed backend URL.
- **Backend**: Deploy `backend` directory to **Render** (Build Command: `npm install`, Start Command: `node server.js`). Set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` environment variables.
- **Database**: Host MongoDB on **MongoDB Atlas** and pass the connection string via `MONGODB_URI`.
