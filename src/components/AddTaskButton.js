import React from 'react';
import { FaPlus } from 'react-icons/fa';
import './AddTaskButton.css';

const AddTaskButton = ({ onClick }) => (
  <button className="add-task-btn" onClick={onClick}>
    <FaPlus className="add-task-icon" />
    <span>Add Task</span>
  </button>
);

export default AddTaskButton;
