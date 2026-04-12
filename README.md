# 🏫 EduManage — School Management System

A full-stack school management platform built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend). Manage students, teachers, fees, attendance, exams, and notices — all in one dashboard.

---

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | https://school-management-system-khaki-nine.vercel.app |
| **Backend API (Render)** | https://school-management-system-b84y.onrender.com |
| **API Health Check** | https://school-management-system-b84y.onrender.com/api100b/health |

> ⚠️ The backend is on Render's **free tier** — it spins down after 15 min of inactivity. The first request may take 30–50 seconds (a warm-up ping fires automatically when you open the homepage).

---

## 🔑 API Reference

### Base URL
```
https://school-management-system-b84y.onrender.com/api100b
```

All protected routes require a **Bearer token** in the `Authorization` header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

### 🔐 Auth Routes — `/api100b/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/signup` | ❌ | Register a new admin user |
| `POST` | `/auth/login` | ❌ | Login and receive JWT token |
| `POST` | `/auth/logout` | ✅ | Logout (client deletes token) |

**POST `/auth/signup`** — Request Body:
```json
{
  "username": "priyanshu",
  "email": "admin@school.com",
  "password": "yourpassword"
}
```
**Response:**
```json
{
  "message": "User registered successfully",
  "user": { "_id": "...", "username": "priyanshu" },
  "token": "<JWT>"
}
```

**POST `/auth/login`** — Request Body:
```json
{
  "username": "priyanshu",
  "password": "yourpassword"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "user": { "_id": "...", "username": "priyanshu" },
  "token": "<JWT>"
}
```

---

### 🏫 School Routes — `/api100b/school` *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/school/registration-status` | Check if school is registered |
| `POST` | `/school/register` | Register a new school |
| `GET` | `/school/dashboard` | Get dashboard stats |
| `GET` | `/school/account` | Get school account info |
| `POST` | `/school/account/upi` | Update UPI ID |
| `GET` | `/school/classes/add` | Get add-class form data |
| `POST` | `/school/classes/add` | Add new classes to school |

---

### 👨‍🎓 Student Routes — `/api100b/student` *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/student/addStudent` | Get class list for add form |
| `POST` | `/student/addStudent` | Add one or more students |
| `GET` | `/student/students` | List all students (supports `?search=`, `?classId=`) |
| `GET` | `/student/profile/:id` | Get single student profile |
| `GET` | `/student/qrcode/:id` | Generate student fee QR code (PNG) |
| `GET` | `/student/feeDetails/:id` | Get student fee details (public) |

---

### 👨‍🏫 Teacher Routes — `/api100b/teacher` *(mixed)*

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/teacher/teachers` | ✅ | List all teachers |
| `GET` | `/teacher/teachers/add` | ✅ | Get class list for add form |
| `POST` | `/teacher/teachers/add` | ✅ | Add a new teacher |
| `GET` | `/teacher/:id/qrcode.png` | ✅ | Generate teacher portal QR (PNG) |
| `GET` | `/teacher/portal/:id` | ❌ | Public teacher portal data |
| `POST` | `/teacher/add-homework/:teacherId` | ❌ | Post homework |
| `POST` | `/teacher/mark-attendance/:classId` | ❌ | Mark class attendance |
| `POST` | `/teacher/upload-marks/:classId` | ❌ | Upload exam marks |

---

### 💰 Fee Routes — `/api100b/fee` *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/fee/fees` | List all transactions |
| `POST` | `/fee/upload/:studentId/:schoolId/:amount` | Upload payment screenshot (OCR) |
| `POST` | `/fee/verify-statement` | Verify PDF bank statement |

---

### ✅ Attendance Routes — `/api100b/attendance` *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/attendance/attendance` | View all attendance records |
| `GET` | `/attendance/report` | Attendance report |

---

### 📢 Notice Routes — `/api100b/notice` *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/notice/notices` | List all notices |
| `POST` | `/notice/notices` | Post a new notice |

---

### 📝 Exam Routes — `/api100b/exam` *(protected)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/exam/exams` | List all exams |
| `POST` | `/exam/exams` | Create a new exam |
| `GET` | `/exam/:id/marks` | Get marks for an exam |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Backend** | Node.js, Express 5, Passport.js (JWT) |
| **Database** | MongoDB Atlas (Mongoose 8) |
| **Auth** | JWT (`jsonwebtoken`) + `passport-local-mongoose` |
| **QR Codes** | `qrcode` npm package |
| **OCR** | `tesseract.js` (payment screenshot parsing) |
| **File Uploads** | `multer` |
| **Frontend Host** | Vercel |
| **Backend Host** | Render (Free tier) |

---

## 🚀 Local Development

### Prerequisites
- Node.js v18+
- MongoDB Atlas URI (or local MongoDB)

### Backend
```bash
cd backend
npm install
# Create a .env file:
# MONGO_URL=your_mongodb_atlas_url
# JWT_SECRET=your_secret_key
# FRONTEND_URL=http://localhost:5173
npm run dev   # runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
# Create a .env.local file:
# VITE_API_URL=http://localhost:8080/api100b
npm run dev   # runs on http://localhost:5173
```

---

## 📁 Project Structure

```
school-management-system/
├── backend/
│   ├── app.js              # Express app + DB connection
│   ├── middleware.js        # JWT auth middleware
│   ├── render.yaml          # Render deploy config
│   ├── controllers/         # Route handlers
│   │   ├── auth.js
│   │   ├── school.js
│   │   ├── student.js
│   │   ├── teacher.js
│   │   ├── fee.js
│   │   ├── attendance.js
│   │   ├── notice.js
│   │   └── exam.js
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   └── utils/
│       └── network.js
│
└── frontend/
    ├── src/
    │   ├── api.js           # Axios instance + interceptors
    │   ├── App.jsx          # Routes + auth state
    │   ├── components/
    │   │   └── Layout.jsx   # Sidebar layout
    │   ├── pages/           # All page components
    │   └── index.css        # Global dark-mode styles
    ├── .env.production      # VITE_API_URL for Vercel build
    └── vercel.json          # SPA rewrite rules
```

---

## 🔧 Environment Variables

### Backend (set in Render dashboard)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `supersecret123` |
| `FRONTEND_URL` | Vercel frontend URL (for QR codes + CORS) | `https://school-management-system-khaki-nine.vercel.app` |
| `PORT` | Auto-set by Render | `10000` |

### Frontend (set in Vercel dashboard)

| Variable | Description | Value |
|----------|-------------|-------|
| `VITE_API_URL` | Render backend base URL | `https://school-management-system-b84y.onrender.com/api100b` |

---

## 📱 QR Code Features

- **Student Fee QR** — Generated at `/api100b/student/qrcode/:id`, links to the student's public fee & homework portal
- **Teacher Portal QR** — Generated at `/api100b/teacher/:id/qrcode.png`, links to the teacher's public portal for attendance & marks
- Both QR codes resolve to **Vercel frontend URLs** (set via `FRONTEND_URL` env var)

---

## 👤 Author

**Priyanshu Agrawal**
- GitHub: [@priyanshu-agrawal-cse](https://github.com/priyanshu-agrawal-cse)
- Project: [school-management-system](https://github.com/priyanshu-agrawal-cse/school-management-system)

---

*Last Updated: April 12, 2026*
