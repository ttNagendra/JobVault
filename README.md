# 🚀 JobVault — MERN Stack Job Portal

A production-ready full-stack job portal built with **MongoDB**, **Express**, **React**, and **Node.js**.

🔗 **Live Demo:** [JobVault on Vercel](https://jobvault.vercel.app) · **API:** Hosted on [Render](https://render.com)

---

## ✨ Features

- **JWT Authentication** with httpOnly cookies
- **Role-based Access** — Job Seeker, Recruiter, Admin
- **Job CRUD** with search, filter, sort, and pagination
- **Application Management** — apply, track, accept/reject
- **Resume Upload** — PDF upload to Cloudinary via Multer (5MB limit, PDF-only validation)
- **Resume Download** — Recruiters can download applicant resumes directly
- **One-click Demo Login** — instant demo accounts for Job Seeker and Recruiter
- **Dark / Light Mode** — theme toggle with persistent preference
- **Modern UI** — Tailwind CSS, glassmorphism, gradients, micro-animations
- **Toast Notifications** — react-hot-toast
- **Protected Routes** — frontend and backend

---

## 🎮 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Job Seeker | `seeker1@gmail.com` | `123456` |
| Recruiter | `rohit@technova.com` | `123456` |

> Click the **Job Seeker** or **Recruiter** button on the login page for one-click demo login.

---

## 🌐 Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| **Backend API** | [Render](https://render.com) | Auto-deploys from `main` branch |
| **Frontend** | [Vercel](https://vercel.com) | Vite build, auto-deploys from `main` branch |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Free-tier cluster |
| **File Storage** | [Cloudinary](https://cloudinary.com) | Resume PDFs stored in `jobportal/resumes` |

---

## 📁 Folder Structure

```
job/
├── backend/
│   ├── config/          # DB & Cloudinary + Multer storage config
│   ├── controllers/     # Auth, Job, Application, Admin
│   ├── middleware/       # auth, authorizeRoles, uploadResume, error
│   ├── models/          # User, Job, Application (Mongoose)
│   ├── routes/          # RESTful route definitions
│   ├── utils/           # ApiError, catchAsync, sendToken
│   ├── seedDemoUsers.js # Seed demo accounts
│   ├── server.js        # Express entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, Spinner, ProtectedRoute
│   │   ├── context/     # AuthContext (React Context + useReducer)
│   │   ├── pages/       # Home, Login, Register, JobDetails, PostJob, etc.
│   │   ├── services/    # Axios API instance
│   │   ├── App.jsx      # React Router
│   │   └── main.jsx     # Entry point
│   └── .env.example
└── README.md
```

---

## 🛠️ Local Setup

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local install or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- **Cloudinary** account (free tier — for resume uploads)

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env   # Edit with your values
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Configure Environment Variables

**Backend `.env`:**

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRE` | Token expiry (e.g. `7d`) |
| `COOKIE_EXPIRE` | Cookie expiry in days |
| `FRONTEND_URL` | Frontend origin for CORS |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

**Frontend `.env`:**

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

### 3. Seed Demo Accounts (Optional)

```bash
cd backend
node seedDemoUsers.js
```

This creates the two demo accounts (Job Seeker & Recruiter) used by the login page's quick-login buttons.

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📤 Resume Upload Flow

```
Frontend (JobDetails.jsx)
  └─ FormData { resume: <PDF file> }
      └─ POST /api/v1/applications/apply/:jobId
          └─ isAuthenticated → authorizeRoles("seeker")
              └─ uploadResume (multer middleware)
                  ├─ fileFilter: PDF only
                  ├─ limits: 5MB max
                  └─ CloudinaryStorage → jobportal/resumes/
                      └─ applyToJob controller
                          └─ Saves Application { job, applicant, resume: URL, status }
```

- **Accepted format:** PDF only
- **Max file size:** 5 MB
- **Storage:** Cloudinary `jobportal/resumes` folder
- **Recruiter view:** Download resume link on the applicant card

---

## 📡 API Reference

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/api/v1/auth/register` | POST | ✗ | — | Register new user |
| `/api/v1/auth/login` | POST | ✗ | — | Login with email/password |
| `/api/v1/auth/logout` | GET | ✓ | — | Logout (clear cookie) |
| `/api/v1/auth/me` | GET | ✓ | — | Get current user |
| `/api/v1/jobs` | GET | ✗ | — | List all jobs |
| `/api/v1/jobs/:id` | GET | ✗ | — | Get job details |
| `/api/v1/jobs` | POST | ✓ | Recruiter | Create a job |
| `/api/v1/jobs/:id` | PUT | ✓ | Recruiter | Update a job |
| `/api/v1/jobs/:id` | DELETE | ✓ | Recruiter/Admin | Delete a job |
| `/api/v1/jobs/me/posted` | GET | ✓ | Recruiter | Get recruiter's jobs |
| `/api/v1/applications/apply/:jobId` | POST | ✓ | Seeker | Apply with PDF resume |
| `/api/v1/applications/me` | GET | ✓ | Seeker | Get my applications |
| `/api/v1/applications/job/:jobId` | GET | ✓ | Recruiter | Get applicants for a job |
| `/api/v1/applications/:id` | PUT | ✓ | Recruiter | Update application status |
| `/api/v1/admin/users` | GET | ✓ | Admin | List all users |
| `/api/v1/admin/users/:id` | DELETE | ✓ | Admin | Delete a user |
| `/api/v1/admin/jobs` | GET | ✓ | Admin | List all jobs (admin) |
| `/api/v1/admin/jobs/:id` | DELETE | ✓ | Admin | Delete a job (admin) |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + httpOnly cookies + bcryptjs |
| **File Upload** | Multer + multer-storage-cloudinary |
| **Cloud Storage** | Cloudinary (PDF resumes) |
| **Hosting** | Render (API) · Vercel (Frontend) |
| **Notifications** | react-hot-toast |

---

## 📝 License

MIT
