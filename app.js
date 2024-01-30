const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Add bcrypt for password hashing

const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const PORT = process.env.PORT || 3500;
const MONGODB_URI = "your_mongodb_connection_string";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the uploaded files
const fileSchema = new mongoose.Schema({
  name: String,
  path: String,
});

const File = mongoose.model("File", fileSchema);

// Define a schema for user data
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

app.use(express.json()); // Add this line to parse JSON requests

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    // You can add a token or session management here for user authentication

    return res.json({ status: "success", message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// File upload route
app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".pdf"]),
  fileSizeLimiter,
  async (req, res) => {
    // Your existing file upload code
  }
);

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
