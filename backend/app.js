const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");//authorijation
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Classes = require("./models/classes.js");
const School = require("./models/school.js");
const Student = require("./models/student.js");
const Transaction = require("./models/transaction.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const QRCode = require("qrcode");
const Tesseract = require("tesseract.js");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const os = require("os");
const Teacher = require("./models/teacher");
const Homework = require("./models/homework");

const upload = multer({ storage: multer.memoryStorage() });


function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (let interfaceName in interfaces) {
    for (let iface of interfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}






const db_url = "mongodb+srv://priyanshuagrawal303_db_user:mEwSJXEuWfIM4rBJ@cluster0.twtmegh.mongodb.net/?appName=Cluster0";
async function main() {
  await mongoose.connect(db_url);
};

main()
  .then((res) => {
    console.log("connection to database is stablished")
  })
  .catch(err => console.log(err));


const cors = require("cors");
app.use(cors({ origin: "*", credentials: true })); // Configure origin properly for production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {

  res.locals.currUser = req.user;
  next();
})

// Sessions removed for JWT approach



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});







// ===== ROUTES =====
const authRoutes = require("./routes/auth");
const schoolRoutes = require("./routes/school");
const studentRoutes = require("./routes/student");
const teacherRoutes = require("./routes/teacher");
const feeRoutes = require("./routes/fee");
const attendanceRoutes = require("./routes/attendance");
const noticeRoutes = require("./routes/notice");
const examRoutes = require("./routes/exam");

const apiPrefix = '/api/school-mgmt';

app.use(apiPrefix + "/auth", authRoutes);
app.use(apiPrefix + "/school", schoolRoutes);
app.use(apiPrefix + "/student", studentRoutes);
app.use(apiPrefix + "/teacher", teacherRoutes);
app.use(apiPrefix + "/fee", feeRoutes);
app.use(apiPrefix + "/attendance", attendanceRoutes);
app.use(apiPrefix + "/notice", noticeRoutes);
app.use(apiPrefix + "/exam", examRoutes);

app.listen(8080, '0.0.0.0', () => {
    console.log("Server is running on port 8080");
});

