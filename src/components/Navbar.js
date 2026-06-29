// Navbar — shows app title and Add Task button
import React from "react";

function Navbar({ onAddClick }) {
  return (
    <nav className="navbar">
      <h1>📋 TaskNest</h1>
      <button className="btn-add" onClick={onAddClick}>
        + Add Task
      </button>
    </nav>
  );
}

export default Navbar;
