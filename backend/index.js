/**
 * TaskNest Backend API
 * Built with Node.js + Express.js
 * Database: MongoDB Atlas
 * Routes: GET, POST, PUT, DELETE for tasks + User model
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware — allows frontend to talk to backend
app.use(cors());
app.use(express.json());

// =====================
// MONGODB CONNECTION
// =====================
const MONGODB_URL =
  "mongodb+srv://tasknestuser:tasknest123@cluster0.fpyx8vc.mongodb.net/?appName=Cluster0"; // You will fill this in next step!

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log("❌ Error:", err));

// =====================
// TASK SCHEMA + MODEL
// =====================
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  dueDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

// =====================
// USER SCHEMA + MODEL
// =====================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// =====================
// TASK API ROUTES
// =====================

// GET all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new task
app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Task deleted!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =====================
// USER API ROUTES
// =====================

// GET all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST register new user
app.post("/api/users/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({
      message: "✅ User registered!",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
app.listen(3001, () => console.log("🚀 TaskNest server running on port 3001"));
