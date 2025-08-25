import React from 'react';
import { FaPlus } from 'react-icons/fa';
import './AddTaskButton.css';
import PropTypes from 'prop-types';

const AddTaskButton = ({ onClick }) => (
  <button type="button" className="add-task-btn" onClick={onClick}>
    <FaPlus className="add-task-icon" />
    <span>Add Task</span>
  </button>
);

AddTaskButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddTaskButton;
