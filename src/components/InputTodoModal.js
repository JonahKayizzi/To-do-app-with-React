import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import InputTodo from './InputTodo';
import './InputTodoModal.css';

const InputTodoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>
        <InputTodo onTaskAdded={onClose} />
      </div>
    </div>
  );
};

InputTodoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InputTodoModal;
