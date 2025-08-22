import React from 'react';
import InputTodo from './InputTodo';
import { FaTimes } from 'react-icons/fa';
import './InputTodoModal.css';

const InputTodoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button className="modal-close-btn" onClick={onClose}>
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
