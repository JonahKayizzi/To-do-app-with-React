import React, { useState } from 'react';
import {
  FaExclamationTriangle, FaClock, FaCalendarAlt, FaChevronDown, FaChevronRight,
} from 'react-icons/fa';
import { useTodo } from '../context/TodoContext';
import TodoItem from './TodoItem';
import './TodoContainer.css';

const TodoContainer = () => {
  const {
    getTodosByCategory, getDueTasks, getOverdueTasks,
  } = useTodo();
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [showOverdueCount, setShowOverdueCount] = useState(10);

  const groupedTodos = getTodosByCategory();
  const dueTasks = getDueTasks();
  const overdueTasks = getOverdueTasks();

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleSubcategory = (subcategoryId) => {
    setExpandedSubcategories((prev) => ({
      ...prev,
      [subcategoryId]: !prev[subcategoryId],
    }));
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FaExclamationTriangle className="priority-icon high" />;
      case 'medium':
        return <FaClock className="priority-icon medium" />;
      case 'low':
        return <FaCalendarAlt className="priority-icon low" />;
      default:
        return null;
    }
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

  return (
    <div className="todo-container">
      <div className="todo-container-grid">
        {/* Left Column - Overdue and Due Tasks */}
        <div className="left-column">
          {/* Overdue Tasks Section */}
          {overdueTasks.length > 0 && (
            <div className="section-container overdue-tasks">
              <div className="section-header">
                <h2 className="section-title">
                  <FaExclamationTriangle className="section-icon overdue" />
                  Overdue Tasks
                </h2>
                <span className="task-count overdue">{overdueTasks.length}</span>
              </div>
              <div className="overdue-tasks-list">
                {overdueTasks.slice(0, showOverdueCount).map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
                {overdueTasks.length > showOverdueCount && (
                  <button
                    type="button"
                    onClick={() => setShowOverdueCount((prev) => prev + 10)}
                    className="load-more-btn"
                  >
                    Load More (
                    {overdueTasks.length - showOverdueCount}
                    {' '}
                    remaining)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Due Tasks Section */}
          {dueTasks.length > 0 && (
            <div className="section-container due-tasks">
              <div className="section-header">
                <h2 className="section-title">
                  <FaClock className="section-icon" />
                  Tasks Due Soon
                </h2>
                <span className="task-count">{dueTasks.length}</span>
              </div>
              <div className="due-tasks-grid">
                {dueTasks.slice(0, 6).map((todo) => (
                  <div key={todo.id} className="due-task-card">
                    <div className="due-task-header">
                      <span className="due-task-title">{todo.title}</span>
                      <span
                        className="due-task-priority"
                        style={{ backgroundColor: getPriorityColor(todo.priority) }}
                      >
                        {todo.priority}
                      </span>
                    </div>
                    <div className="due-task-time">
                      {getPriorityIcon(todo.priority)}
                      <span>
                        Due:
                        {' '}
                        {new Date(todo.deadline).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Categories and All Tasks */}
        <div className="right-column">
          {/* Categories Section */}
          <div className="section-container categories">
            <div className="section-header">
              <h2 className="section-title">
                <FaCalendarAlt className="section-icon" />
                All Tasks by Category
              </h2>
            </div>

            {Object.values(groupedTodos).map(({ category, subcategories, todos }) => (
              <div key={category.id} className="category-section">
                <div
                  className="category-header"
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleCategory(category.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleCategory(category.id);
                    }
                  }}
                >
                  <div className="category-info">
                    <div
                      className="category-color-indicator"
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="category-name">{category.name}</h3>
                    <span className="category-task-count">{todos.length}</span>
                  </div>
                  {expandedCategories[category.id] ? (
                    <FaChevronDown className="expand-icon" />
                  ) : (
                    <FaChevronRight className="expand-icon" />
                  )}
                </div>

                {expandedCategories[category.id] && (
                  <div className="category-content">
                    {/* Uncategorized tasks in this category */}
                    {todos.filter((todo) => !todo.subcategoryId).length > 0 && (
                      <div className="subcategory-section">
                        <h4 className="subcategory-name">General</h4>
                        <div className="todo-list">
                          {todos
                            .filter((todo) => !todo.subcategoryId)
                            .map((todo) => (
                              <TodoItem key={todo.id} todo={todo} />
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Subcategories */}
                    {Object.values(subcategories).map(({ subcategory, todos: subTodos }) => (
                      <div key={subcategory.id} className="subcategory-section">
                        <div
                          className="subcategory-header"
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleSubcategory(subcategory.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              toggleSubcategory(subcategory.id);
                            }
                          }}
                        >
                          <h4 className="subcategory-name">{subcategory.name}</h4>
                          <span className="subcategory-task-count">{subTodos.length}</span>
                          {expandedSubcategories[subcategory.id] ? (
                            <FaChevronDown className="expand-icon small" />
                          ) : (
                            <FaChevronRight className="expand-icon small" />
                          )}
                        </div>

                        {expandedSubcategories[subcategory.id] && subTodos.length > 0 && (
                          <div className="todo-list">
                            {subTodos.map((todo) => (
                              <TodoItem key={todo.id} todo={todo} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* If no subcategories, show all todos directly */}
                    {Object.keys(subcategories).length === 0 && todos.length > 0 && (
                      <div className="todo-list">
                        {todos.map((todo) => (
                          <TodoItem key={todo.id} todo={todo} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* No tasks message */}
            {Object.values(groupedTodos).every(({ todos }) => todos.length === 0) && (
              <div className="no-tasks">
                <FaCalendarAlt className="no-tasks-icon" />
                <h3>No tasks yet</h3>
                <p>Start by adding your first task above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoContainer;
