import React from 'react';
import {
  FaCheckCircle, FaClock, FaExclamationTriangle, FaCalendarAlt, FaTasks,
} from 'react-icons/fa';
import { useTodo } from '../context/TodoContext';
import './SummaryStatistics.css';

const SummaryStatistics = () => {
  const { state, getDueTasks, getOverdueTasks } = useTodo();

  const totalTodos = state.todos.length;
  const completedTodos = state.todos.filter((todo) => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const dueTasks = getDueTasks();
  const overdueTasks = getOverdueTasks();

  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTodos,
      icon: <FaTasks />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      label: 'Total Tasks',
    },
    {
      title: 'Completed',
      value: completedTodos,
      icon: <FaCheckCircle />,
      color: '#10b981',
      bgColor: '#ecfdf5',
      label: 'Completed',
    },
    {
      title: 'Pending',
      value: pendingTodos,
      icon: <FaClock />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      label: 'Pending',
    },
    {
      title: 'Due Soon',
      value: dueTasks.length,
      icon: <FaCalendarAlt />,
      color: '#8b5cf6',
      bgColor: '#f3f4f6',
      label: 'Due Soon',
    },
    {
      title: 'Overdue',
      value: overdueTasks.length,
      icon: <FaExclamationTriangle />,
      color: '#ef4444',
      bgColor: '#fef2f2',
      label: 'Overdue',
    },
  ];

  return (
    <div className="summary-statistics">
      <div className="summary-header">
        <h2 className="summary-title">
          <FaTasks className="summary-icon" />
          Task Overview
        </h2>
      </div>

      <div className="completion-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="completion-text">
          <span className="completion-percentage">
            {completionRate}
            %
          </span>
          <span className="completion-label">Complete</span>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={`stat-${stat.label}`} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {totalTodos === 0 && (
        <div className="no-stats">
          <FaTasks className="no-stats-icon" />
          <p>No tasks yet. Start by adding your first task!</p>
        </div>
      )}
    </div>
  );
};

export default SummaryStatistics;
