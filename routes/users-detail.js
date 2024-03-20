const { getUser, addUser, updateUser } = require("../models/users");

const express = require("express");
const router = express.Router();

const multer = require("multer");
// Multer configuration for file uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  // Accept only png, pdf, and jpg files
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, PDF, and JPG files are allowed"));
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

// API endpoint to fetch all users
router.get("/api/users-detail", async (req, res) => {
  try {
    let user = await getUser();
    res.status(200).json({ result: true, message: "", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/api/users-detail/add",
  upload.single("profile"),
  async (req, res) => {
    try {
      let params = req.body;
      // Check if a file was uploaded

      console.log("req.file", params);
      if (req.file) {
        // If a file was uploaded, add its path to user data
        params.profile = req.file.filename;
      }

      let result = await addUser(params);
      console.log("add User---", req.body, result);

      res.status(200).json({ result: true, message: "", data: result });
    } catch (error) {
      res.status(500).json({ return: false, message: error.message });
    }
  }
);
router.put("/api/users-detail/update/:id", async (req, res) => {
  try {
    let params = req.body;

    let result = await updateUser(req.params.id, params);
    console.log("result---", result);

    res.status(200).json({ result: true, message: "", data: result });
  } catch (error) {
    res.status(500).json({ return: false, message: error.message });
  }
});

module.exports = router;
