const express = require('express');
const User = require('../models/usersModel')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const router = express.Router();
const path = require("path");
const bcrypt = require('bcrypt'); // Make sure it's imported

// Serve static files from uploads/ (e.g., /users/uploads/filename.jpg)
router.use('/profilePhotos', express.static(path.join(__dirname, 'profilePictures')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'profilePictures')); // Correct path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});


const upload = multer({storage})

router.post("/create", upload.single("profilePhoto"), async (req, res) => {
  const { fullname, username, email, phone, address, state, password } = req.body;
  const profilePhoto = req.file ? req.file.filename : null;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        status: "error",
        message: "Email already exists. Please use a different email.",
      });
    }

    const newUser = new User({
      fullname,
      username,
      email,
      phone,
      address,
      state,
      password,               // Will be hashed in pre-save hook
      plainPassword: password,
      profilePhoto,
      // role: 'user',        // Optional: not needed unless you override
    });
    
    

    await newUser.save();

    return res.json({
      status: "success",
      message: "User created successfully.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error while creating user.",
    });
  }
});

router.get("/profile/:filename",(req,res)=>{
  const {filename} = req.params //equivalent to const filename = req.params.filename 
  const filepath = path.join(__dirname,'/profilePictures',filename)
  console.log(filepath)
  res.sendFile(filepath)
})


router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await authenticate(username, password);
  if (user) {
    const jwtToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      "hello-world",
      { expiresIn: '1h' }
    );

    res.json({
      token: jwtToken,
      user: {
        username: user.username,
        fullname: user.fullname,
        role: user.role,  // Include role and fullname
      }
    });
  } else {
    res.status(403).json({ status: "error", message: "Invalid user" });
  }
});




async function authenticate(username, password) {
  const user = await User.findOne({ username: username });
  if (!user) return null;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;
  return user;
}

module.exports = router;

