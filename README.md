# 🚀 Mastering MERN Stack - Full-Stack Social Media Platform

<div align="center">

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-latest-green)
![Express](https://img.shields.io/badge/express-%5E4.18.0-blue)
![React](https://img.shields.io/badge/react-%5E18.0.0-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.x-brightgreen)

**A production-ready social media platform demonstrating the complete MERN stack**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Development](#-development)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Backend API](#-backend-api)
- [Frontend Application](#-frontend-application)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Mastering MERN** is a comprehensive social media platform built from scratch using the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates **production-ready full-stack development** with modern best practices, authentication, real-time features, and responsive design.

### Why This Project?

- ✅ **Complete Full-Stack**: Backend API + Frontend SPA
- ✅ **Production Patterns**: Authentication, validation, error handling
- ✅ **Real-time Features**: Live updates, notifications, chat
- ✅ **Responsive Design**: Mobile-first UI with modern styling
- ✅ **Educational**: Clean code, comprehensive documentation
- ✅ **Scalable Architecture**: Modular design, separation of concerns

---

## ✨ Features

### User Features
- 🔐 **Authentication**: JWT-based auth with refresh tokens
- 👤 **User Profiles**: Customizable profiles with avatars
- 📝 **Posts**: Create, edit, delete posts with rich media
- 💬 **Comments**: Nested commenting system
- ❤️ **Reactions**: Like, love, and react to posts
- 👥 **Social Graph**: Follow/unfollow users, friend requests
- 🔔 **Notifications**: Real-time notifications
- 💬 **Messaging**: Direct messaging between users
- 🔍 **Search**: Search users, posts, and hashtags
- 📊 **Feed Algorithm**: Personalized content feed

### Technical Features
- 🎯 **RESTful API**: Clean, documented REST endpoints
- 🔄 **Real-time Updates**: WebSocket integration
- 💾 **MongoDB**: NoSQL database with Mongoose ODM
- 🔒 **Security**: bcrypt passwords, JWT tokens, rate limiting
- 📧 **Email Service**: Email verification and notifications
- 🖼️ **File Upload**: Image/video uploads with Cloudinary
- 🚀 **Performance**: Redis caching, pagination, lazy loading
- 📱 **Responsive UI**: Works on desktop, tablet, and mobile

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | Runtime environment |
| **Express.js** | 4.18+ | Web framework |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | 8.x | MongoDB ODM |
| **JWT** | 9.x | Authentication tokens |
| **bcryptjs** | 2.x | Password hashing |
| **Redis** | Latest | Caching and sessions |
| **Bull** | 4.x | Job queues |
| **Socket.io** | 4.x | Real-time communication |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI library |
| **Vite** | 5.x | Build tool |
| **TypeScript** | 5.x | Type safety |
| **React Router** | 6.x | Client-side routing |
| **Axios** | 1.x | HTTP client |
| **React Query** | 5.x | Server state management |
| **Zustand** | 4.x | Client state management |
| **Tailwind CSS** | 3.x | Utility-first CSS |
| **Shadcn/ui** | Latest | UI components |

### DevOps
- **Docker** & **Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **ESLint** & **Prettier** - Code quality

---

## 🏗 Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (React)                    │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
│  │  Pages   │  │Components│  │ State (Zustand)│    │
│  └──────────┘  └──────────┘  └───────────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │     React Query (Server State)             │    │
│  └────────────────────────────────────────────┘    │
└───────────────────┬──────────────────────────────┘
                    │ HTTP/REST
                    ▼
┌─────────────────────────────────────────────────────┐
│              Backend API (Express)                   │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Routes  │→ │Controllers│→│ Services │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                     │               │
│                      ┌──────────────┴───────┐      │
│                      ▼                      ▼       │
│              ┌────────────┐         ┌────────────┐ │
│              │  MongoDB   │         │   Redis    │ │
│              │ (Mongoose) │         │  (Cache)   │ │
│              └────────────┘         └────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Backend Architecture (MVC Pattern)

```
backend/
├── routes/          # Express route definitions
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── post.routes.js
│
├── controllers/     # Route handlers
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── post.controller.js
│
├── services/        # Business logic
│   ├── auth.service.js
│   ├── user.service.js
│   └── post.service.js
│
├── models/          # Mongoose schemas
│   ├── User.model.js
│   ├── Post.model.js
│   └── Comment.model.js
│
├── middleware/      # Express middleware
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   └── error.middleware.js
│
└── utils/           # Helper functions
    ├── email.util.js
    ├── upload.util.js
    └── token.util.js
```

---

## 🚀 Quick Start

Get the platform running locally in **5 minutes**:

### Prerequisites

- **Node.js** >= 20.x
- **MongoDB** (local or Atlas)
- **Redis** (local or cloud)
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/hassonor/mastering-mern.git
cd mastering-mern

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Set up environment variables
cd ../backend
cp .env.example .env
# Edit .env with your configuration

# MongoDB (local)
MONGODB_URI=mongodb://localhost:27017/mern-social

# Redis (local)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# Email (optional - for production)
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@example.com

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Running Locally

#### Option 1: Manual Start

```bash
# Terminal 1 - Start MongoDB (if local)
mongod

# Terminal 2 - Start Redis (if local)
redis-server

# Terminal 3 - Start backend
cd backend
npm run dev

# Terminal 4 - Start frontend
cd frontend
npm run dev
```

#### Option 2: Docker Compose

```bash
# Start all services (MongoDB, Redis, Backend, Frontend)
docker-compose up

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React application |
| **Backend API** | http://localhost:5000 | Express API |
| **API Docs** | http://localhost:5000/api-docs | Swagger documentation |
| **MongoDB** | mongodb://localhost:27017 | Database |
| **Redis** | redis://localhost:6379 | Cache |

---

## 📁 Project Structure

```
mastering-mern/
├── backend/                    # Express backend
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   │   ├── database.js     # MongoDB connection
│   │   │   ├── redis.js        # Redis connection
│   │   │   └── cloudinary.js   # File upload config
│   │   │
│   │   ├── models/             # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   ├── Comment.js
│   │   │   ├── Like.js
│   │   │   └── Notification.js
│   │   │
│   │   ├── routes/             # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── post.routes.js
│   │   │   └── comment.routes.js
│   │   │
│   │   ├── controllers/        # Route controllers
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Express middleware
│   │   ├── utils/              # Helper functions
│   │   ├── validators/         # Request validation
│   │   └── app.js              # Express app setup
│   │
│   ├── tests/                  # Backend tests
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── common/         # Buttons, inputs, etc.
│   │   │   ├── layout/         # Navbar, sidebar, footer
│   │   │   ├── post/           # Post card, create post
│   │   │   └── user/           # User card, profile
│   │   │
│   │   ├── pages/              # Route pages
│   │   │   ├── Home.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   │
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── usePosts.ts
│   │   │   └── useInfiniteScroll.ts
│   │   │
│   │   ├── store/              # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   └── uiStore.ts
│   │   │
│   │   ├── api/                # API client
│   │   │   ├── axios.ts        # Axios instance
│   │   │   ├── auth.api.ts
│   │   │   └── posts.api.ts
│   │   │
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│       └── ci.yml
│
├── docker-compose.yml          # Docker services
└── README.md
```

---

## 🔧 Backend API

### Key Endpoints

#### Authentication
```bash
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
POST   /api/auth/refresh       # Refresh access token
GET    /api/auth/me            # Get current user
POST   /api/auth/logout        # Logout user
```

#### Users
```bash
GET    /api/users              # Get all users (paginated)
GET    /api/users/:id          # Get user by ID
PUT    /api/users/:id          # Update user profile
DELETE /api/users/:id          # Delete user
POST   /api/users/:id/follow   # Follow user
DELETE /api/users/:id/follow   # Unfollow user
```

#### Posts
```bash
GET    /api/posts              # Get feed (paginated)
POST   /api/posts              # Create post
GET    /api/posts/:id          # Get post by ID
PUT    /api/posts/:id          # Update post
DELETE /api/posts/:id          # Delete post
POST   /api/posts/:id/like     # Like post
DELETE /api/posts/:id/like     # Unlike post
```

#### Comments
```bash
GET    /api/posts/:postId/comments       # Get comments
POST   /api/posts/:postId/comments       # Add comment
PUT    /api/comments/:id                 # Update comment
DELETE /api/comments/:id                 # Delete comment
```

---

## 💻 Frontend Application

### Key Features

#### Authentication Flow
```tsx
// Login component with form validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

function Login() {
  const login = useAuthStore(state => state.login);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

#### Data Fetching with React Query
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost } from '@/api/posts.api';

function Feed() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  return <div>...</div>;
}
```

---

## 🧪 Testing

### Backend Tests

```bash
# Run backend tests
cd backend
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Frontend Tests

```bash
# Run frontend tests
cd frontend
npm test

# E2E tests (Playwright)
npm run test:e2e
```

---

## 🚢 Deployment

### Backend Deployment (Railway/Render)

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

### Docker Deployment

```bash
# Build and run all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [Or Hasson](https://github.com/hassonor)**

⭐ Star this repo if you're learning the MERN stack!

</div>
