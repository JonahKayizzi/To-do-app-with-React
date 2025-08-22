import React, { useState } from 'react';
import {
  FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaExclamationTriangle, FaClock, FaCheck,
} from 'react-icons/fa';
import moment from 'moment';
import { useTodo } from '../context/TodoContext';
import './TodoItem.css';

const TodoItem = ({ todo }) => {
  const {
    state, toggleTodo, deleteTodo, updateTodo,
  } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: todo.title,
    description: todo.description || '',
    categoryId: todo.categoryId,
    subcategoryId: todo.subcategoryId,
    deadline: todo.deadline ? new Date(todo.deadline) : null,
    priority: todo.priority || 'medium',
    location: todo.location || '',
  });

  const category = state.categories.find((cat) => cat.id === todo.categoryId);
  const subcategory = state.subcategories.find((sub) => sub.id === todo.subcategoryId);

  const priorityColors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#EF4444',
  };

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  const getTimeUntilDeadline = () => {
    if (!todo.deadline) return null;

    const now = moment();
    const deadline = moment(todo.deadline);
    const diff = deadline.diff(now, 'hours', true);

    if (diff < 0) {
      return { type: 'overdue', text: `Overdue by ${Math.abs(Math.round(diff))} hours` };
    } if (diff <= 1) {
      return { type: 'urgent', text: `Due in ${Math.round(diff * 60)} minutes` };
    } if (diff <= 6) {
      return { type: 'warning', text: `Due in ${Math.round(diff)} hours` };
    } if (diff <= 24) {
      return { type: 'info', text: `Due in ${Math.round(diff)} hours` };
    }
    const days = Math.floor(diff / 24);
    return { type: 'normal', text: `Due in ${days} days` };
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editForm.title.trim()) {
      updateTodo({
        ...todo,
        ...editForm,
        deadline: editForm.deadline ? editForm.deadline.toISOString() : null,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      categoryId: todo.categoryId,
      subcategoryId: todo.subcategoryId,
      deadline: todo.deadline ? new Date(todo.deadline) : null,
      priority: todo.priority || 'medium',
      location: todo.location || '',
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTodo(todo.id);
    }
  };

  const timeInfo = getTimeUntilDeadline();

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="edit-form">
          <div className="edit-row">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="edit-title"
              placeholder="Task title"
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
            className="edit-description"
            placeholder="Description"
            rows="2"
          />

          <div className="edit-row">
            <select
              value={editForm.categoryId || ''}
              onChange={(e) => {
                setEditForm({
                  ...editForm,
                  categoryId: e.target.value || null,
                  subcategoryId: null,
                });
              }}
              className="edit-category"
            >
              <option value="">No Category</option>
              {state.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={editForm.subcategoryId || ''}
              onChange={(e) => setEditForm({ ...editForm, subcategoryId: e.target.value || null })}
              className="edit-subcategory"
              disabled={!editForm.categoryId}
            >
              <option value="">No Subcategory</option>
              {state.subcategories
                .filter((sub) => sub.categoryId === editForm.categoryId)
                .map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
            </select>
          </div>

          <div className="edit-row">
            <input
              type="datetime-local"
              value={editForm.deadline ? moment(editForm.deadline).format('YYYY-MM-DDTHH:mm') : ''}
              onChange={(e) => setEditForm({
                ...editForm,
                deadline: e.target.value ? new Date(e.target.value) : null,
              })}
              className="edit-deadline"
            />

            <input
              type="text"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              className="edit-location"
              placeholder="Location"
            />
          </div>

          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${timeInfo?.type === 'overdue' ? 'overdue' : ''}`}>
      <div className="todo-content">
        <div className="todo-header">
          <div className="todo-title-section">
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
            >
              {todo.completed && <FaCheck />}
            </button>
            <h3 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
              {todo.title}
            </h3>
          </div>

          <div className="todo-priority">
            <span
              className="priority-badge"
              style={{ backgroundColor: priorityColors[todo.priority] }}
            >
              {priorityLabels[todo.priority]}
            </span>
          </div>
        </div>

        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}

        <div className="todo-meta">
          {category && (
            <span className="category-tag" style={{ backgroundColor: category.color }}>
              {category.name}
            </span>
          )}

          {subcategory && (
            <span className="subcategory-tag">
              {subcategory.name}
            </span>
          )}
        </div>

        <div className="todo-details">
          {todo.deadline && (
            <div className="detail-item">
              <FaCalendarAlt className="detail-icon" />
              <span className="detail-text">
                {moment(todo.deadline).format('MMM D, YYYY h:mm A')}
              </span>
              {timeInfo && (
                <span className={`time-remaining ${timeInfo.type}`}>
                  {timeInfo.text}
                </span>
              )}
            </div>
          )}

          {todo.location && (
            <div className="detail-item">
              <FaMapMarkerAlt className="detail-icon" />
              <span className="detail-text">{todo.location}</span>
            </div>
          )}
        </div>

        <div className="todo-actions">
          <button onClick={handleEdit} className="action-btn edit-btn">
            <FaEdit />
          </button>
          <button onClick={handleDelete} className="action-btn delete-btn">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
