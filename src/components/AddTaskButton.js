import React from 'react';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';
import './AddTaskButton.css';

const AddTaskButton = ({ onClick }) => (
  <button type="button" className="add-task-button" onClick={onClick}>
    <FaPlus />
    Add Task
  </button>
);

AddTaskButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddTaskButton;
