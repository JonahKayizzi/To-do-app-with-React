import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import {
  FaCalendarAlt, FaGoogle,
} from 'react-icons/fa';
import { useTodo } from '../context/TodoContext';
import 'react-datepicker/dist/react-datepicker.css';
import './InputTodo.css';

const InputTodo = ({ onTaskAdded }) => {
  const {
    state, addTodo, addCategory, addSubcategory,
  } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState('');
  const [addToCalendar, setAddToCalendar] = useState(false);

  // Category management
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3B82F6');

  // Subcategory management
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryCategoryId, setNewSubcategoryCategoryId] = useState('');

  const priorityOptions = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#EF4444' },
  ];

  const categoryOptions = state.categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    color: cat.color,
  }));

  const subcategoryOptions = selectedCategory
    ? state.subcategories
      .filter((sub) => sub.categoryId === selectedCategory.value)
      .map((sub) => ({
        value: sub.id,
        label: sub.name,
      }))
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const todo = {
      title: title.trim(),
      description: description.trim(),
      categoryId: selectedCategory?.value || null,
      subcategoryId: selectedSubcategory?.value || null,
      deadline: deadline ? deadline.toISOString() : null,
      priority,
      location: location.trim(),
      addToCalendar,
    };

    addTodo(todo);

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setDeadline(null);
    setPriority('medium');
    setLocation('');
    setAddToCalendar(false);

    // Call callback if provided
    if (onTaskAdded) {
      onTaskAdded();
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setNewCategoryColor('#3B82F6');
      setShowCategoryForm(false);
    }
  };

  const handleAddSubcategory = (e) => {
    e.preventDefault();
    if (newSubcategoryName.trim() && newSubcategoryCategoryId) {
      addSubcategory(newSubcategoryName.trim(), newSubcategoryCategoryId);
      setNewSubcategoryName('');
      setNewSubcategoryCategoryId('');
      setShowSubcategoryForm(false);
    }
  };

  const customSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.color || '#000',
      backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.data.color || '#000',
    }),
  };

  return (
    <div className="input-todo-container">
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-row">
          <div className="form-group title-group">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="todo-input"
              required
            />
          </div>

          <div className="form-group priority-group">
            <Select
              value={priorityOptions.find((opt) => opt.value === priority)}
              onChange={(option) => setPriority(option.value)}
              options={priorityOptions}
              styles={customSelectStyles}
              placeholder="Priority"
              isSearchable={false}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="todo-textarea"
              rows="2"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <Select
              value={selectedCategory}
              onChange={(option) => {
                setSelectedCategory(option);
                setSelectedSubcategory(null);
              }}
              options={categoryOptions}
              styles={customSelectStyles}
              placeholder="Select Category"
              isClearable
            />
            <button
              type="button"
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="add-category-btn"
            >
              +
            </button>
          </div>

          <div className="form-group">
            <Select
              value={selectedSubcategory}
              onChange={setSelectedSubcategory}
              options={subcategoryOptions}
              placeholder="Select Subcategory"
              isClearable
              isDisabled={!selectedCategory}
            />
            {selectedCategory && (
              <button
                type="button"
                onClick={() => setShowSubcategoryForm(!showSubcategoryForm)}
                className="add-subcategory-btn"
              >
                +
              </button>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <div className="date-picker-wrapper">
              <FaCalendarAlt className="date-icon" />
              <DatePicker
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Set Deadline"
                minDate={new Date()}
                className="date-picker"
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="location-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label className="checkbox-label" htmlFor="add-to-calendar">
              <input
                id="add-to-calendar"
                type="checkbox"
                checked={addToCalendar}
                onChange={(e) => setAddToCalendar(e.target.checked)}
                className="checkbox"
              />
              <FaGoogle className="google-icon" />
              Add to Google Calendar
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Add Task
        </button>
      </form>

      {/* Add Category Form */}
      {showCategoryForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Category</h3>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="color-picker"
                />
                <span>Choose Color</span>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Add Category</button>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subcategory Form */}
      {showSubcategoryForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Subcategory</h3>
            <form onSubmit={handleAddSubcategory}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Subcategory Name"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>
              <div className="form-group">
                <Select
                  value={categoryOptions.find((opt) => opt.value === newSubcategoryCategoryId)}
                  onChange={(option) => setNewSubcategoryCategoryId(option.value)}
                  options={categoryOptions}
                  placeholder="Select Parent Category"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Add Subcategory</button>
                <button
                  type="button"
                  onClick={() => setShowSubcategoryForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

InputTodo.propTypes = {
  onTaskAdded: PropTypes.func,
};

InputTodo.defaultProps = {
  onTaskAdded: null,
};

export default InputTodo;
