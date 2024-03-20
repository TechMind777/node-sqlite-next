// index.js

const express = require("express");
const cors = require('cors');

const { connectDatabase } = require("./db/sqlite");
const router = require("./routes");

connectDatabase();

const bodyParser = require("body-parser");

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Allow requests from all origins
app.use(cors());
// Serve static files from the 'public' folder
app.use(express.static("public"));

// app.use('/api/users',router.user);
app.use(router.user);
app.use(router.usersDetail);
app.use(router.payments);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
