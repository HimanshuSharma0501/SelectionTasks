const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Sample data
const users = {
  john_doe: { email: "john@example.com", password: "password123" },
  // can add more
};
//Sample posts
let posts = [
  {
    id: 1,
    title: "Post 1",
    content: "This is the first post.",
    likes: 0,
    comments: [],
  },
  {
    id: 2,
    title: "Post 2",
    content: "This is the second post.",
    likes: 0,
    comments: [],
  },
  // can add more
];

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

// 2 CRUD

//2.1 Create
app.post("/posts", (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    likes: 0,
    comments: [],
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

// 2.2 Read
//  all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

//  specific post
app.get("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post);
});

// 2.3 Update

app.put("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  const updatedPost = { ...posts[postIndex], ...req.body };
  posts[postIndex] = updatedPost;

  res.json(updatedPost);
});

// 2.4 Delete
app.delete("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter((p) => p.id !== postId);

  res.json({ message: "Post deleted successfully" });
});

// 3 Likes and Comments

//3.1 Likes

app.post("/posts/:id/like", (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  posts[postIndex].likes += 1;

  res.json({ message: "Post liked successfully" });
});

//3.2 Comments

app.post("/posts/:id/comment", (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  const { comment } = req.body;
  posts[postIndex].comments.push(comment);

  res.json({ message: "Comment added successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
