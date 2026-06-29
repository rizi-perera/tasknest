// TaskCard — shows one task with title, description, badges, dates and action buttons
import React from "react";

function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-info">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <div style={{ marginBottom: "8px" }}>
          <span
            className={`badge badge-${
              task.status === "Completed" ? "completed" : "pending"
            }`}
          >
            {task.status}
          </span>
          <span className={`badge badge-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>
        <small>
          📅 Created: {new Date(task.createdAt).toLocaleDateString()}
        </small>
        {task.dueDate && (
          <small style={{ marginLeft: "12px" }}>
            ⏰ Due: {new Date(task.dueDate).toLocaleDateString()}
          </small>
        )}
      </div>
      <div className="task-actions">
        <button className="btn-edit" onClick={() => onEdit(task)}>
          ✏️ Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(task)}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
