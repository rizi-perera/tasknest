// DeleteModal — popup that asks user to confirm before deleting a task
import React from "react";

function DeleteModal({ task, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>🗑️ Delete Task?</h2>
        <p>
          Are you sure you want to delete <strong>"{task.title}"</strong>? This
          cannot be undone.
        </p>
        <div className="modal-buttons">
          <button className="btn-cancel-modal" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
