# 🚀 Intellectify — Full Stack Social Media Platform

A scalable **microservices-based** full-stack social media application built with **React + TypeScript + Vite** on the frontend and **NestJS microservices** on the backend.

---

<h2 id="navigation">📋 Navigation</h2>

<nav>

• <a href="#architecture">Full Stack Architecture</a>  
• <a href="#project-structure">Project Structure</a>  
• <a href="#frontend">Frontend Overview</a>  
• <a href="#backend">Backend Overview</a>  
• <a href="#features">Features</a>  
• <a href="#tech-stack">Tech Stack</a>  
• <a href="#quick-start">Quick Start</a>  
• <a href="#installation">Installation</a>  
• <a href="#configuration">Configuration</a>  
• <a href="#docker-deployment">Docker & Deployment</a>  
• <a href="#available-scripts">Available Scripts</a>  
• <a href="#auth-flow">Authentication Flow</a>  
• <a href="#api-docs">API Documentation</a>  
• <a href="#license">License</a>

</nav>

---

<h2 id="architecture">🏗 Full Stack Architecture</h2>

Intellectify is a complete full-stack web application with clear separation of concerns:

```
Frontend (React) → API Gateway → Microservices → PostgreSQL
```

<h3>Service Architecture</h3>

| Service       | Port        | Responsibility                                    |
| ------------- | ----------- | ------------------------------------------------- |
| API Gateway   | 3000        | Central entry point for all requests              |
| Auth Service  | 3001        | Authentication & JWT token management             |
| Users Service | 3002        | User profiles & follow relationships              |
| Posts Service | 3003        | Posts, likes, comments management                 |
| Mail Service  | 3004        | SMTP relay & email service (connects to Mailtrap) |
| PostgreSQL    | 5432        | Data persistence                                  |
| RabbitMQ      | 5672, 15672 | 5672 → Message queue & event bus                  |
|               |             | 15672 → Management UI                             |

**Components:**

- **Frontend**: React + TypeScript + Vite - Interactive user interface
- **Backend**: NestJS microservices - RESTful API with scalability
- **Communication**: Axios HTTP client for API requests
- **Database**: PostgreSQL for reliable data storage
- **Deployment**: Docker containerized services with Docker Compose

---

---

<h2 id="project-structure">📂 Project Structure</h2>

The repository is organized using a microservices-based structure with clear separation between frontend and backend services.

intellectify/
│
├─ frontend/
│ ├─ src/
│ ├─ public/
│ └─ vite.config.ts
│
├─ backend/
│ ├─ api-gateway/
│ ├─ auth-service/
│ ├─ users-service/
│ ├─ posts-service/
│ ├─ mail-service/
│ ├─ docker-compose.yml
│  
│
└─ README.md

---

<h2 id="frontend">🎨 Frontend Overview</h2>

A modern React + TypeScript + Vite frontend application providing an interactive social media experience.

<h3>Frontend Technologies</h3>

| Technology               | Purpose                            |
| ------------------------ | ---------------------------------- |
| **React 18**             | UI Framework                       |
| **TypeScript**           | Type-safe development              |
| **Vite**                 | Fast build tool & dev server       |
| **Tailwind CSS**         | Utility-first styling              |
| **React Router v6**      | Client-side routing                |
| **Jotai**                | Lightweight state management       |
| **TanStack React Query** | Data fetching & caching            |
| **TanStack Form**        | Form state management & validation |
| **Zod**                  | Schema validation library          |

<h3>Data Fetching with TanStack React Query</h3>

The app uses **TanStack React Query** (`@tanstack/react-query`) to manage server state, cache API responses, and handle loading/error patterns. Typical usage includes `useQuery` for reading resources and `useMutation` for updates (posts, bookmarks, likes, user data).

- Automatic caching and stale data handling
- Background refetching and retry logic
- Simple mutation hooks with optimistic update support
- Works well with the custom hooks in `src/features/**` and API layer

<h3>Form Handling & Validation</h3>

The frontend uses **TanStack Form** for robust form state management and **Zod** for schema-based validation. This combination provides:

- Type-safe form handling with TypeScript
- Declarative validation schemas
- Real-time field validation
- Error handling and user feedback
- Reusable form components (e.g., `FormInputField`)

Example usage in components like `Login.tsx`, `Register.tsx`, and `ForgotPassword.tsx`.

---

<h2 id="backend">🔧 Backend Overview</h2>

A scalable NestJS backend with microservices architecture.

<h3>Backend Technologies</h3>

| Technology         | Purpose                           |
| ------------------ | --------------------------------- |
| **NestJS**         | Progressive Node.js framework     |
| **TypeScript**     | Type-safe backend development     |
| **PostgreSQL**     | Relational database               |
| **TypeORM**        | Object-Relational Mapping         |
| **JWT**            | Secure token-based authentication |
| **RabbitMQ**       | Message broker for microservices  |
| **Nodemailer**     | SMTP (Protocol) email delivery    |
| **Mailtrap**       | Email testing & delivery service  |
| **Docker**         | Container virtualization          |
| **Docker Compose** | Multi-container orchestration     |

**Services Include:**

- **API Gateway** - Routes all incoming requests to appropriate microservices
- **Auth Service** - Handles user registration, login, JWT token generation
- **Users Service** - Manages user profiles, follow relationships, user stats
- **Posts Service** - Manages posts, likes, comments, post queries
- **Mail Service** - Handles transactional emails (password reset, verification, notifications)

<h3>Microservice Communication</h3>

Intellectify uses two communication patterns:

• **HTTP (REST)** – Client → API Gateway → Services  
• **Event-driven (RabbitMQ)** – Inter-service communication

---

<h2 id="features">✨ Features</h2>

<h3>Authentication & Security</h3>
- User registration and login with validation
- Secure session management with JWT tokens
- Protected routes for authenticated users only
- Role-based access control (Admin/User)
- Account settings and password management
- Secure password reset via email with JWT tokens
- Email verification through Mailtrap SMTP

<h3>Posts Management</h3>
- Create, edit, and delete posts with images
- Like and unlike posts with real-time counters
- Comment on posts with nested replies
- View detailed post information with author profile
- Browse feed with pagination
- Follow post authors directly from post details

<h3>Bookmarks & Collections</h3>
- Bookmark posts for later viewing
- Organize bookmarks in custom collections
- View bookmark details with full content
- Manage and remove bookmarks

<h3>User Profiles & Social</h3>
- Public user profiles accessible via `/@username`
- View user's posts, likes, and bookmarks
- Follow/unfollow users with visual feedback
- Personal profile page with account settings
- User statistics dashboard showing:
  - Created posts count
  - Liked posts count
  - Total comments
  - Bookmarks count
- User role badges (Admin/User)

<h3>Admin Features</h3>
- User management dashboard
- View all users and their activity
- Admin moderation controls
- User management panel

---

<h2 id="tech-stack">🛠 Tech Stack</h2>

| Category                  | Technologies                                                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**              | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Jotai, Axios, Lucide React, React Toastify, TanStack React Query, TanStack Form, Zod |
| **Backend**               | NestJS, TypeScript, PostgreSQL, TypeORM, JWT Authentication                                                                                     |
| **Architecture**          | Microservices Architecture, API Gateway Pattern, RESTful APIs                                                                                   |
| **Containerization**      | Docker, Docker Compose                                                                                                                          |
| **State & Communication** | Jotai (state management), Axios (HTTP client), JWT (authentication flow)                                                                        |
| **Development Tools**     | ESLint, Jest, Postman, Git, npm                                                                                                                 |

---

<h2 id="quick-start">⚡ Quick Start</h2>

```bash
# Start backend services
cd backend
docker-compose up -d

# Start frontend development server
cd ../frontend
npm install
npm run dev
```

Access the application:

- Frontend: <a href="http://localhost:5173">http://localhost:5173</a>
- API Gateway: <a href="http://localhost:3000">http://localhost:3000/api/v1</a>
- API Docs: <a href="http://localhost:3000/api">http://localhost:3000/api/v1/docs</a>

---

<h2 id="installation">📦 Installation</h2>

Prerequisites: Node 18+, Docker

```bash
git clone <repo-url>
cd intellectify
```

<h3 id="frontend-install">Frontend Installation</h3>

```bash
cd frontend
npm install
npm run dev
```

<h3 id="backend-install">Backend Installation</h3>

```bash
cd backend
npm install
docker-compose up -d
```

---

<h2 id="configuration">⚙️ Configuration</h2>

<h3>Frontend Configuration</h3>

Create `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

<h3>Backend Configuration</h3>

Create `.env` file in `/backend`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-db-password
DB_NAME=intellectify

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h
JWT_RESET_TOKEN_SECRET=your-reset-token-secret-key-here
JWT_RESET_TOKEN_EXPIRATION=15m

# Email Configuration (SMTP Protocol - Provider: Mailtrap)
MAIL_FROM=no-reply@intellectify.com
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=25
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password

# Services
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
USERS_SERVICE_PORT=3002
POSTS_SERVICE_PORT=3003
MAIL_SERVICE_PORT=3004

# Node Environment
NODE_ENV=dev
```

<h3>Environment Variables Explained</h3>

| Variable                     | Purpose                         | Example                        |
| ---------------------------- | ------------------------------- | ------------------------------ |
| `VITE_API_URL`               | Frontend API endpoint           | `http://localhost:3000/api/v1` |
| `DB_HOST`                    | Database hostname               | `localhost` or container name  |
| `DB_PORT`                    | PostgreSQL port                 | `5432`                         |
| `DB_USERNAME`                | Database user                   | `postgres`                     |
| `DB_PASSWORD`                | Database password               | Secure password                |
| `DB_NAME`                    | Database name                   | `intellectify`                 |
| `JWT_SECRET`                 | Secret key for JWT tokens       | Random string (min 32 chars)   |
| `JWT_EXPIRATION`             | Token expiration time           | `24h` or `7d`                  |
| `JWT_RESET_TOKEN_SECRET`     | Secret key for JWT reset tokens | Random string (min 32 chars)   |
| `JWT_RESET_TOKEN_EXPIRATION` | Password reset token expiration | `15m` or `30m`                 |
| `MAIL_FROM`                  | Email sender address            | `no-reply@intellectify.com`    |
| `SMTP_HOST`                  | SMTP server hostname            | `smtp.mailtrap.io`             |
| `SMTP_PORT`                  | SMTP server port                | `25`                           |
| `SMTP_USER`                  | Mailtrap/SMTP username          | Your Mailtrap account username |
| `SMTP_PASS`                  | Mailtrap/SMTP password          | Your Mailtrap API token        |
| `NODE_ENV`                   | Environment mode                | `dev` or `prod`                |

---

<h2 id="docker-deployment">🐳 Docker & Deployment</h2>

<h3>Docker Architecture</h3>

```
┌──────────────────────────────────────┐
│       Docker Compose Network         │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────┐   │
│  │   API Gateway (Port 3000)    │   │
│  └────────────┬─────────────────┘   │
│               │                      │
│  ┌────────┬───┴─────┬────────┬
│  │        │         │        │       │
│  ▼        ▼         ▼        ▼       │
│  Auth   Users    Posts      Mail
│  3001   3002     3003       3004
│                                      │
│  ┌──────────────────────────────┐   │
│  │   PostgreSQL (Port 5432)     │   │
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

<h3>Docker Services</h3>

| Service       | Port | Purpose                   | Status       |
| ------------- | ---- | ------------------------- | ------------ |
| api-gateway   | 3000 | Main entry point          | Required     |
| auth-service  | 3001 | Authentication            | Microservice |
| users-service | 3002 | User management           | Microservice |
| posts-service | 3003 | Post management           | Microservice |
| mail-service  | 3004 | Mail service (SMTP relay) | Microservice |
| postgres      | 5432 | Database                  | Required     |

<h3>Docker Compose Commands</h3>

```bash
cd backend

# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api-gateway

# Restart specific service
docker-compose restart auth-service

# Rebuild images
docker-compose build --no-cache

# Remove volumes (careful - deletes data)
docker-compose down -v
```

<h3>Docker Commands for Individual Services</h3>

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# View container logs
docker logs <container-id>

# Execute command in container
docker exec -it <container-id> bash

# Stop specific container
docker stop <container-id>

# Remove container
docker rm <container-id>
```

<h3>Debugging Docker Issues</h3>

```bash
# Check if port is already in use
lsof -i :3000

# View service health
docker-compose ps

# Inspect network
docker network ls
docker network inspect intellectify_default

# Check database connection
docker exec -it intellectify_db psql -U postgres -d intellectify -c "SELECT 1;"
```

---

<h2 id="available-scripts">📜 Available Scripts</h2>

Frontend:

```bash
npm run dev
npm run build
```

Backend:

```bash
npm run start
npm run test
```

---

---

<h2 id="auth-flow">🔐 Authentication Flow</h2>

1. User logs in or registers
2. Backend returns JWT token
3. Token stored in frontend state
4. Axios interceptor attaches token to requests
5. Protected routes validate token

<h3>Password Reset Flow</h3>

1. User requests password reset with email
2. Auth Service generates JWT reset token (15 minutes expiration)
3. Reset link with token sent via Mailtrap SMTP
4. User clicks link and submits new password
5. Token validated and password updated in database
6. Confirmation email sent to user

**Security Features:**

- Reset tokens expire after 15 minutes
- Email verification prevents unauthorized password resets
- Secure SMTP connection via Mailtrap

---

<h2 id="api-docs">📚 API Documentation</h2>

Interactive API documentation available at:

```
http://localhost:3000/api/v1/docs
```

**Swagger UI** - Interactive endpoint testing
**ReDoc** - API reference documentation

<h3>API Base URL</h3>

```
http://localhost:3000/api/v1
```

---

<h2 id="license">📝 License</h2>

This project is licensed under the **MIT License**.

---
