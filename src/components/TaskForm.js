// TaskForm — form to create a new task or edit an existing one
import React, { useState, useEffect } from "react";

function TaskForm({ onSave, onCancel, editingTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");

  // If editing, fill form with existing task data
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "");
    }
  }, [editingTask]);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please enter a task title!");
      return;
    }
    onSave({ title, description, status, priority, dueDate });
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setPriority("Low");
    setDueDate("");
  };

  return (
    <div className="form-container">
      <h2 className="page-title">
        {editingTask ? "✏️ Edit Task" : "➕ Add New Task"}
      </h2>

      <div className="form-group">
        <label>Task Title *</label>
        <input
          type="text"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          placeholder="Enter task description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="form-group">
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button className="btn-save" onClick={handleSubmit}>
        {editingTask ? "✅ Update Task" : "💾 Save Task"}
      </button>
      <button className="btn-cancel-form" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

export default TaskForm;
