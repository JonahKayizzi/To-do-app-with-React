import React from 'react';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import InputTodo from './InputTodo';
import './InputTodoModal.css';

const InputTodoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') onClose();
      }}
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="modal-title">Add New Task</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <InputTodo onTaskAdded={onClose} />
        </div>
      </div>
    </div>
  );
};

export default InputTodoModal;

InputTodoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
