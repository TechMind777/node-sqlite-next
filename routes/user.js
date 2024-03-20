
const { getUser, addUser, updateUser, getUserByUsernameAndPassword } = require("../models/users");

const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const multer = require('multer');
// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = function (req, file, cb) {
    // Accept only png, pdf, and jpg files
    if (file.mimetype === 'image/png' || file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(new Error('Only PNG, PDF, and JPG files are allowed'));
    }
};

const limits = {
    fileSize: 5 * 1024 * 1024 // 5 MB
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: limits });


// API endpoint to fetch all users
router.get("/api/users", async (req, res) => {
    try {
      let user = await getUser();
      res.status(200).json({ result: true, message: "", data: user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post("/api/users/add", async (req, res) => {
    try {
      let params = req.body; 
  

      // Hash the password
      const hashedPassword = params.password ;//await bcrypt.hash(params.password, 10);

      params.password = hashedPassword; 
  
      let result = await addUser(params);
      console.log("add User---", req.body, result);
  
      res.status(200).json({ result: true, message: "", data: result });
    } catch (error) {
      res.status(500).json({ return: false, message: error.message });
    }
  });
  router.put("/api/users/update/:id", async (req, res) => {
    try {
      let params = req.body; 
      
      if (req.file) {
          // If a file was uploaded, add its path to user data
          params.profile_pic = req.file.filename;
      }
  
      let result = await updateUser(req.params.id, params);
      console.log("result---", result);
  
      res.status(200).json({ result: true, message: "", data: result });
    } catch (error) {
      res.status(500).json({ return: false, message: error.message });
    }
  });


router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await getUserByUsernameAndPassword(username, password);
      if (user) {

          // Verify the password
          // const passwordMatch = await bcrypt.compare(password, user.password);
          const passwordMatch = (password == user.password);
          if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }

          let SECRET_KEY = process.env.SECRET_KEY || 'test'
          // Generate JWT token
          const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
          

          res.status(200).json({ success: true, message: 'Login successful', data: user, token });
      } else {
          res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

  module.exports = router