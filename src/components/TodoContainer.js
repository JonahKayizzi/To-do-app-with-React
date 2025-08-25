import React, { useContext } from 'react';
import { FaExclamationTriangle, FaClock } from 'react-icons/fa';
import TodoItem from './TodoItem';
import { TodoContext } from '../context/TodoContext';
import './TodoContainer.css';

const TodoContainer = () => {
  const { todos, categories } = useContext(TodoContext);

  const getTodosByCategory = (categoryId) => todos.filter((todo) => todo.categoryId === categoryId);

  const getOverdueTodos = () => {
    const now = new Date();
    return todos.filter((todo) => {
      if (!todo.deadline || todo.completed) return false;
      return new Date(todo.deadline) < now;
    });
  };

  const getDueSoonTodos = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return todos.filter((todo) => {
      if (!todo.deadline || todo.completed) return false;
      const deadline = new Date(todo.deadline);
      return deadline >= now && deadline <= tomorrow;
    });
  };

  const getUpcomingTodos = () => {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return todos.filter((todo) => {
      if (!todo.deadline || todo.completed) return false;
      const deadline = new Date(todo.deadline);
      return deadline > now && deadline <= nextWeek;
    });
  };

  const overdueTodos = getOverdueTodos();
  const dueSoonTodos = getDueSoonTodos();
  const upcomingTodos = getUpcomingTodos();

  return (
    <div className="todo-container">
      <div className="todo-container-grid">
        <div className="left-column">
          {/* Overdue Tasks Section */}
          {overdueTodos.length > 0 && (
            <div className="todo-section overdue-section">
              <div className="section-header">
                <FaExclamationTriangle className="section-icon overdue" />
                <h3>Overdue Tasks</h3>
                <span className="task-count">{overdueTodos.length}</span>
              </div>
              <div className="todo-list">
                {overdueTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            </div>
          )}

          {/* Due Tasks Section */}
          {dueSoonTodos.length > 0 && (
            <div className="todo-section due-soon-section">
              <div className="section-header">
                <FaClock className="section-icon due-soon" />
                <h3>Due Soon</h3>
                <span className="task-count">{dueSoonTodos.length}</span>
              </div>
              <div className="todo-list">
                {dueSoonTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks Section */}
          {upcomingTodos.length > 0 && (
            <div className="todo-section upcoming-section">
              <div className="section-header">
                <FaClock className="section-icon upcoming" />
                <h3>Upcoming Tasks</h3>
                <span className="task-count">{upcomingTodos.length}</span>
              </div>
              <div className="todo-list">
                {upcomingTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="right-column">
          {/* Categories Section */}
          {categories.map((category) => {
            const categoryTodos = getTodosByCategory(category.id);
            if (categoryTodos.length === 0) return null;

            return (
              <div key={category.id} className="todo-section category-section">
                <div className="section-header">
                  <h3>{category.name}</h3>
                  <span className="task-count">{categoryTodos.length}</span>
                </div>
                <div className="todo-list">
                  {categoryTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Uncategorized Tasks Section */}
          {(() => {
            const uncategorizedTodos = todos.filter((todo) => !todo.categoryId);
            if (uncategorizedTodos.length === 0) return null;

            return (
              <div className="todo-section uncategorized-section">
                <div className="section-header">
                  <h3>Uncategorized</h3>
                  <span className="task-count">{uncategorizedTodos.length}</span>
                </div>
                <div className="todo-list">
                  {uncategorizedTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default TodoContainer;
