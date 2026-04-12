const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ===== DATABASE =====
const db_url = process.env.MONGO_URL || "mongodb+srv://priyanshuagrawal303_db_user:mEwSJXEuWfIM4rBJ@cluster0.twtmegh.mongodb.net/?appName=Cluster0";
mongoose.connect(db_url)
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB Error:", err));

// ===== MIDDLEWARE =====
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL || "https://school-management-system-khaki-nine.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== PASSPORT (stateless - no sessions) =====
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===== ROUTES =====
const authRoutes = require("./routes/auth");
const schoolRoutes = require("./routes/school");
const studentRoutes = require("./routes/student");
const teacherRoutes = require("./routes/teacher");
const feeRoutes = require("./routes/fee");
const attendanceRoutes = require("./routes/attendance");
const noticeRoutes = require("./routes/notice");
const examRoutes = require("./routes/exam");

const apiPrefix = '/api100b';

app.use(apiPrefix + "/auth", authRoutes);
app.use(apiPrefix + "/school", schoolRoutes);
app.use(apiPrefix + "/student", studentRoutes);
app.use(apiPrefix + "/teacher", teacherRoutes);
app.use(apiPrefix + "/fee", feeRoutes);
app.use(apiPrefix + "/attendance", attendanceRoutes);
app.use(apiPrefix + "/notice", noticeRoutes);
app.use(apiPrefix + "/exam", examRoutes);

// Health check
app.get("/api100b/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`School Management API running on port ${PORT}`);
});
