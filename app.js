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

const upload = multer({ storage: multer.memoryStorage() });


const db_url = "mongodb://127.0.0.1:27017/chruch"
async function main() {
  await mongoose.connect(db_url);
};

main()
  .then((res) => {
    console.log("connection to database is stablished")
  })
  .catch(err => console.log(err));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.use((req,res,next)=>{
  
    res.locals.currUser = req.user;
    next();
})

const store = MongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: process.env.SECRECT,
  },
  touchAfter: 24 * 3600,
})

store.on("error", (err) => {
  console.log("error in mongo session store ", err)
})



let sessionOption = {
  store,
  secret: "jduiedb",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,

  },

};




app.use(session(sessionOption));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const ru = await User.register(newUser, password); // Passport-local-mongoose

    console.log("New user registered:", ru);
        req.session.schoolId = req.user._id;

    // ✅ Store user in session (passport handles this if using req.login)
    req.login(ru, (err) => {
      if (err) throw err;
      // Redirect to school registration form
      res.redirect("/schoolRegistration");
    });

  } catch (e) {
    res.status(400).send(e.message);
  }
});





app.get("/login", (req, res) => {
  res.render("users/login.ejs");
})

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    // failureFlash: true, // optional if using connect-flash
  }),
  (req, res) => {
    // ✅ At this point, login is successful and req.user exists
    // Store schoolId (or userId) in session
    console.log("User logged in:", req.user._id);
    req.session.schoolId = req.user._id;
console.log("User logged in:", req.session.schoolId );
   

    res.redirect("/dashboard"); // or wherever you want to land
  }
);




app.get("/schoolRegistration", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login"); // secure the route
  }
  res.render("school/schoolRegistrationFrom.ejs"); // your EJS/templating engine
});


app.post("/schoolRegistration", async (req, res) => {
  try {
    // Get logged-in user from session
    const userId = req.user._id;

    const { name, phoneNumber, upiId, hostelFee, classId } = req.body;
const rawClasses = req.body.classId;
    let formattedClasses = [];

    if (Array.isArray(rawClasses.class)) {
      // multiple classes
      for (let i = 0; i < rawClasses.class.length; i++) {
        formattedClasses.push({
          class: rawClasses.class[i],
          section: rawClasses.section[i],
          acadmicFee: rawClasses.acadmicFee[i],
        });
      }
    } else {
      // single class
      formattedClasses.push({
        class: rawClasses.class,
        section: rawClasses.section,
        acadmicFee: rawClasses.acadmicFee,
      });
    }

    // Now insert classes
    const createdClasses = await Classes.insertMany(formattedClasses);
    // ✅ Step 1: Create classes
    // classId is an array of { class, section, acadmicFee }
    
    // ✅ Step 2: Create school linked to user and created classes
    const school = new School({
      name,

      phoneNumber,
      upiId,
      hostelFee,
       user: userId,  // or better: link userId instead of email
      classId: createdClasses.map(c => c._id),
    });

    await school.save();

    res.status(201).send("School registered successfully!");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering school");
  }
});



app.get("/dashboard",(req,res)=>{
  res.render("student/dashboard.ejs");
})







app.get("/viewStudent",async (req,res)=>{
  const student = await Student.find().populate("classId");
    // console.log("User found:", student);
  res.render("student/viewStudent.ejs",{student});
})



app.get("/addStudent", async (req, res) => {
  try {
//     console.log("Session:", req.session);
// console.log("schoolId:", req.session.schoolId);

    // Check how session is stored
    const schoolId = req.session.schoolId || req.session.school?._id;

    if (!schoolId) {
      return res.redirect("/login");
    }

    // Find school and populate its classes
    // const user = await User.findOne({ _id: schoolId });
    const school = await School.findOne({ user: schoolId }).populate("classId");
    // console.log("User found:", school);

    if (!school) {
      return res.status(404).send("School not found");
    }

    res.render("student/addStudent.ejs",{school});
  } catch (err) {
    console.error("Error in /addStudent:", err);
    res.status(500).send("Server error");
  }
});




// POST route to add students
app.post("/addStudent", async (req, res) => {
  try {
    const { name, father_name, phoneNumber, rollNumber, hostel, classId } = req.body;

    // Debug incoming data
    console.log("Raw student body:", req.body);

    const studentsToInsert = [];

    if (Array.isArray(name)) {
      // Multiple students
      for (let i = 0; i < name.length; i++) {
        studentsToInsert.push({
          name: name[i],
          father_name: father_name[i],
          phoneNumber: phoneNumber[i],
          rollNumber: rollNumber[i],
          hostel: hostel[i],
          classId: classId[i],
        });
      }
    } else {
      // Single student (when no array is created by form)
      studentsToInsert.push({
        name,
        father_name,
        phoneNumber,
        rollNumber,
        hostel,
        classId,
      });
    }

    // Insert all students in one go
    await Student.insertMany(studentsToInsert);

    res.redirect("/viewStudent"); // redirect to student list page
    // or res.status(201).send("Students added successfully");
  } catch (err) {
    console.error("Error adding students:", err);
    res.status(500).send("Server error while adding students");
  }
});




//image handling page
app.get("/student/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    // (Optional) fetch student details from DB
    const student = await Student.findById(studentId).populate("classId");

    if (!student) {
      return res.status(404).send("Student not found");
    }

    // Render an EJS page with student + QR code
    res.render("student/studentProfile.ejs", { student });
  } catch (err) {
    console.error("Error loading student page:", err);
    res.status(500).send("Server error");
  }
});



//handling qr code 
app.get("/student/:id/qrcode.png", async (req, res) => {
  try {
    const studentId = req.params.id;

    // 👉 the link that QR should open when scanned
    const targetUrl = `http://localhost:8080/studentFeedetails/${studentId}`;

    // Generate PNG buffer
    const qrBuffer = await QRCode.toBuffer(targetUrl, {
      type: "png",
      width: 300,
      errorCorrectionLevel: "H",
    });

    // Send PNG as response
    res.type("png");
    res.send(qrBuffer);
  } catch (err) {
    console.error("QR generation error:", err);
    res.status(500).send("Error generating QR code");
  }
});



//students rotes for fee
app.get("/studentFeedetails/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    // 1. Get student + class
    const student = await Student.findById(studentId).populate("classId");
    if (!student) {
      return res.status(404).send("Student not found");
    }

    // 2. Find the school that has this class in its classId array
    const school = await School.findOne({ classId: student.classId._id });
    if (!school) {
      return res.status(404).send("School not found for this class");
    }


    const transaction = await Transaction.find({studentId:student._id});
    // 3. Render fee details
    res.render("student/studentFeedetails.ejs", { student, school , transaction});
  } catch (err) {
    console.error("Error fetching fee details:", err);
    res.status(500).send("Server error");
  }
});



//inserting transaction
app.post(
  "/upload-transaction/:studentId/:schoolId/:amount",
  upload.single("transactionImage"), // must match input name in form
  async (req, res) => {
    try {
      const { studentId, schoolId, amount } = req.params;

      if (!req.file || !req.file.buffer) {
        return res.status(400).send("No file uploaded");
      }

      // Run OCR directly on the image buffer
      const {
        data: { text },
      } = await Tesseract.recognize(req.file.buffer, "eng");

      // console.log("Extracted text:", text);

      // Regex patterns to find UTR or fallback transaction ID
      const utrMatch = text.match(/\b\d{10,12}\b/); // UTR: 10–12 digits
      const txnMatch = text.match(/\b\d{6,10}\b/);  // fallback: 6–10 digits

      const transactionId = utrMatch?.[0] || txnMatch?.[0];

      if (!transactionId) {
        return res.status(400).send("Could not extract UTR/Transaction number");
      }

      // Save transaction with status = Pending
      const newTxn = new Transaction({
        UTR: transactionId,
        studentId,
        schoolId,
        amount,
        status: "Pending",
      });

      await newTxn.save();

      res.redirect(`/studentFeedetails/${studentId}`);
    } catch (err) {
      console.error("Error processing transaction upload:", err);
      res.status(500).send("Server error");
    }
  }
);




//fees route
 app.get("/fees", async(req, res) => {
    // Check how session is stored
    const schoolId = req.session.schoolId || req.session.school?._id;

    if (!schoolId) {
      return res.redirect("/login");
    }

    // Find school and populate its classes
    // const user = await User.findOne({ _id: schoolId });
    const school = await School.findOne({ user: schoolId }).populate("classId");

  const transactions = await Transaction.find({ schoolId: school._id })
  .populate({
    path: "studentId",
    populate: {
      path: "classId",   // inside student
      model: "Classes"
    }
  });

    // console.log("User found:", school);

    if (!school) {
      return res.status(404).send("School not found");
    }
   res.render("student/seeingTotalFess.ejs",{transactions, school});
 })


 //acount section
 app.get("/account", async(req, res) => {
   const schoolId = req.session.schoolId || req.session.school?._id;

    if (!schoolId) {
      return res.redirect("/login");
    }

    // Find school and populate its classes
    // const user = await User.findOne({ _id: schoolId });
    const school = await School.findOne({ user: schoolId }).populate("classId");
    // Check how session is stored
    res.render("student/accountsection.ejs",{school});
 })

 //update upi id 
 app.post('/save-upi-details', async (req, res) => {
    try {
        const { transactionId } = req.body;

          const schoolId = req.session.schoolId || req.session.school?._id;

    if (!schoolId) {
      return res.redirect("/login");
    }

    // Find school and populate its classes
    // const user = await User.findOne({ _id: schoolId });
    const school = await School.findOne({ user: schoolId })

        if (!school) {
            return res.status(404).send('School not found');
        }

        school.upiId = transactionId;
        await school.save();

        res.redirect('/account'); // or wherever you want to redirect
    } catch (err) {
        console.error('Error updating UPI ID:', err);
        res.status(500).send('Internal Server Error');
    }
});



app.get("/", (req, res) => {
  res.send("hello ");
})


app.listen(8080, '0.0.0.0', () => {
  console.log("Server is running");
});
