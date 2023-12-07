const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Sample data
const users = {
  john_doe: { email: "john@example.com", password: "password123" },
  // can add more
};

app.use(bodyParser.json());

// 1.1 User Registration API
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (users[username]) {
    return res.status(400).json({ error: "Username already exists" });
  }

  users[username] = { email, password };
  return res.status(201).json({ message: "User registered successfully" });
});

// 1.2 User Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  return res.status(200).json({ message: "Login successful" });
});

// 1.3 Forget User Password API
app.post("/forget_password", (req, res) => {
  const { username } = req.body;

  if (!users[username]) {
    return res.status(404).json({ error: "Username not found" });
  }

  // logic to send reset link using nodemailer etc.

  return res.status(200).json({
    message:
      "Password reset instructions sent to the email associated with the account",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
