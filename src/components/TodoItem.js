import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FaEdit, FaTrash, FaCheck, FaUndo, FaCalendarAlt, FaMapMarkerAlt, FaExclamationCircle,
} from 'react-icons/fa';
import { useTodo } from '../context/TodoContext';
import './TodoItem.css';

const TodoItem = ({ todo }) => {
  const {
    updateTodo, deleteTodo, categories, subcategories,
  } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: todo.title,
    description: todo.description,
    categoryId: todo.categoryId || '',
    subcategoryId: todo.subcategoryId || '',
    deadline: todo.deadline ? new Date(todo.deadline).toISOString().slice(0, 16) : '',
    priority: todo.priority,
    location: todo.location || '',
  });

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getSubcategoryName = (subcategoryId) => {
    const subcategory = subcategories.find((sub) => sub.id === subcategoryId);
    return subcategory ? subcategory.name : '';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FaExclamationCircle className="priority-icon high" />;
      case 'medium':
        return <FaExclamationCircle className="priority-icon medium" />;
      case 'low':
        return <FaExclamationCircle className="priority-icon low" />;
      default:
        return null;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      title: todo.title,
      description: todo.description,
      categoryId: todo.categoryId || '',
      subcategoryId: todo.subcategoryId || '',
      deadline: todo.deadline ? new Date(todo.deadline).toISOString().slice(0, 16) : '',
      priority: todo.priority,
      location: todo.location || '',
    });
  };

  const handleSave = () => {
    if (!editForm.title.trim()) {
      return;
    }

    const updatedTodo = {
      ...todo,
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      categoryId: editForm.categoryId || null,
      subcategoryId: editForm.subcategoryId || null,
      deadline: editForm.deadline || null,
      priority: editForm.priority,
      location: editForm.location.trim() || null,
    };

    updateTodo(updatedTodo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteTodo(todo.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleToggleComplete = () => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };
    updateTodo(updatedTodo);
  };

  const isOverdue = todo.deadline && new Date(todo.deadline) < new Date() && !todo.completed;

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="edit-form">
          <div className="form-row">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Task title"
              className="edit-title"
            />
            <select
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
              className="edit-priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            placeholder="Task description"
            className="edit-description"
            rows="2"
          />

          <div className="form-row">
            <select
              value={editForm.categoryId}
              onChange={(e) => {
                setEditForm({ ...editForm, categoryId: e.target.value, subcategoryId: '' });
              }}
              className="edit-category"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={editForm.subcategoryId}
              onChange={(e) => setEditForm({ ...editForm, subcategoryId: e.target.value })}
              className="edit-subcategory"
              disabled={!editForm.categoryId}
            >
              <option value="">Select subcategory</option>
              {subcategories
                .filter((sub) => sub.categoryId === editForm.categoryId)
                .map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-row">
            <input
              type="datetime-local"
              value={editForm.deadline}
              onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
              className="edit-deadline"
            />
            <input
              type="text"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              placeholder="Location"
              className="edit-location"
            />
          </div>

          <div className="edit-actions">
            <button type="button" className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="todo-content">
        <div className="todo-header">
          <div className="todo-title-section">
            <h4 className="todo-title">{todo.title}</h4>
            {todo.description && <p className="todo-description">{todo.description}</p>}
          </div>

          <div className="todo-meta">
            {todo.categoryId && (
              <span className="todo-category">
                {getCategoryName(todo.categoryId)}
              </span>
            )}
            {todo.subcategoryId && (
              <span className="todo-subcategory">
                {getSubcategoryName(todo.subcategoryId)}
              </span>
            )}
          </div>
        </div>

        <div className="todo-details">
          {todo.deadline && (
            <div className="todo-deadline">
              <FaCalendarAlt />
              <span>
                Due:
                {' '}
                {new Date(todo.deadline).toLocaleString()}
              </span>
            </div>
          )}

          <div className="todo-priority">
            {getPriorityIcon(todo.priority)}
            <span style={{ color: getPriorityColor(todo.priority) }}>
              {todo.priority}
            </span>
          </div>

          {todo.location && (
            <div className="todo-location">
              <FaMapMarkerAlt />
              <span>{todo.location}</span>
            </div>
          )}
        </div>

        <div className="todo-actions">
          <button
            type="button"
            className={`complete-btn ${todo.completed ? 'completed' : ''}`}
            onClick={handleToggleComplete}
            title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {todo.completed ? <FaUndo /> : <FaCheck />}
            {todo.completed ? 'Undo' : 'Complete'}
          </button>

          <button
            type="button"
            className="edit-btn"
            onClick={handleEdit}
            title="Edit task"
          >
            <FaEdit />
            Edit
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={handleDelete}
            title="Delete task"
          >
            <FaTrash />
            Delete
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this task?</p>
            <div className="confirmation-buttons">
              <button type="button" onClick={confirmDelete} className="confirm-btn">
                Delete
              </button>
              <button type="button" onClick={cancelDelete} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    categoryId: PropTypes.string,
    subcategoryId: PropTypes.string,
    deadline: PropTypes.string,
    priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    location: PropTypes.string,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
};

export default TodoItem;
