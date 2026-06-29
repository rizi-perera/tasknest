/**
 * TaskNest - Task Management Web App
 * Frontend: React JS, HTML5, CSS3, JavaScript, Tailwind CSS
 * Backend: Node.js + Express.js
 * Database: MongoDB Atlas
 * Features: Create, Read, Update, Delete tasks
 * Bonus: Search, Filter, Priority, Due Date, Dashboard Stats
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";
import DeleteModal from "./components/DeleteModal";
import "./styles.css";

// Replace this with your backend CodeSandbox URL after backend is set up
const API = "https://3vy24w-3001.csb.app";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Load tasks when app first opens
  useEffect(() => {
    fetchTasks();
  }, []);

  // GET — load all tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      // Sample data shown if backend not connected yet
      setTasks([
        {
          _id: "1",
          title: "Buy groceries",
          description: "Milk, eggs, bread",
          status: "Pending",
          priority: "Low",
          dueDate: "2026-06-30",
          createdAt: new Date(),
        },
        {
          _id: "2",
          title: "Finish TaskNest project",
          description: "Complete full stack app",
          status: "Pending",
          priority: "High",
          dueDate: "2026-06-30",
          createdAt: new Date(),
        },
        {
          _id: "3",
          title: "Call doctor",
          description: "Schedule appointment",
          status: "Completed",
          priority: "Medium",
          dueDate: null,
          createdAt: new Date(),
        },
      ]);
    }
  };

  // POST or PUT — create new task or update existing one
  const handleSave = async (taskData) => {
    try {
      if (editingTask) {
        // UPDATE existing task
        const res = await fetch(`${API}/${editingTask._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        const updated = await res.json();
        setTasks(tasks.map((t) => (t._id === editingTask._id ? updated : t)));
      } else {
        // CREATE new task
        const res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
      }
    } catch (err) {
      // Work locally if backend not ready
      if (editingTask) {
        setTasks(
          tasks.map((t) =>
            t._id === editingTask._id ? { ...editingTask, ...taskData } : t
          )
        );
      } else {
        setTasks([
          ...tasks,
          { ...taskData, _id: Date.now().toString(), createdAt: new Date() },
        ]);
      }
    }
    setShowForm(false);
    setEditingTask(null);
  };

  // DELETE — remove a task
  const handleDelete = async () => {
    try {
      await fetch(`${API}/${deletingTask._id}`, { method: "DELETE" });
    } catch (err) {
      console.log("Working locally");
    }
    setTasks(tasks.filter((t) => t._id !== deletingTask._id));
    setDeletingTask(null);
  };

  // Open edit form with task data pre-filled
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Search and filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === "All" || task.status === filterStatus;
    return matchSearch && matchFilter;
  });

  // Dashboard numbers
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

  return (
    <div>
      {/* NAVBAR */}
      <Navbar
        onAddClick={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
      />

      <div className="container">
        {!showForm ? (
          <>
            {/* DASHBOARD STATS */}
            <div className="stats-grid">
              <div className="stat-card">
                <h2>{totalTasks}</h2>
                <p>Total Tasks</p>
              </div>
              <div className="stat-card">
                <h2>{pendingTasks}</h2>
                <p>Pending</p>
              </div>
              <div className="stat-card">
                <h2>{completedTasks}</h2>
                <p>Completed</p>
              </div>
            </div>

            <h2 className="page-title">My Tasks</h2>

            {/* SEARCH BAR */}
            <input
              className="search-bar"
              placeholder="🔍 Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* FILTER BUTTONS */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
              {["All", "Pending", "Completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "20px",
                    border: "none",
                    background: filterStatus === f ? "#1DA1F2" : "#e0e0e0",
                    color: filterStatus === f ? "white" : "#333",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* TASK LIST */}
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <h3>No tasks found! 🎉</h3>
                <p>Click "+ Add Task" to create your first task</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={setDeletingTask}
                />
              ))
            )}
          </>
        ) : (
          /* TASK FORM */
          <TaskForm
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            editingTask={editingTask}
          />
        )}
      </div>

      {/* DELETE MODAL */}
      {deletingTask && (
        <DeleteModal
          task={deletingTask}
          onConfirm={handleDelete}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
}

export default App;
