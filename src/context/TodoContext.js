import React, {
  createContext, useContext, useReducer, useEffect, useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import PropTypes from 'prop-types';

const TodoContext = createContext();

const initialState = {
  categories: [
    { id: '1', name: 'Work', color: '#3B82F6' },
    { id: '2', name: 'Personal', color: '#10B981' },
    { id: '3', name: 'Shopping', color: '#F59E0B' },
    { id: '4', name: 'Health', color: '#EF4444' },
  ],
  subcategories: [
    { id: '1', categoryId: '1', name: 'Meetings' },
    { id: '2', categoryId: '1', name: 'Projects' },
    { id: '3', categoryId: '2', name: 'Family' },
    { id: '4', categoryId: '2', name: 'Hobbies' },
    { id: '5', categoryId: '3', name: 'Groceries' },
    { id: '6', categoryId: '3', name: 'Clothing' },
    { id: '7', categoryId: '4', name: 'Exercise' },
    { id: '8', categoryId: '4', name: 'Medical' },
  ],
  todos: [],
  googleCalendarEvents: [],
  notifications: [],
};

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((cat) => (
          cat.id === action.payload.id ? action.payload : cat
        )),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
        subcategories: state.subcategories.filter((sub) => sub.categoryId !== action.payload),
        todos: state.todos.map((todo) => (
          todo.categoryId === action.payload
            ? { ...todo, categoryId: null, subcategoryId: null }
            : todo
        )),
      };

    case 'ADD_SUBCATEGORY':
      return {
        ...state,
        subcategories: [...state.subcategories, action.payload],
      };

    case 'UPDATE_SUBCATEGORY':
      return {
        ...state,
        subcategories: state.subcategories.map((sub) => (
          sub.id === action.payload.id ? action.payload : sub)),
      };

    case 'DELETE_SUBCATEGORY':
      return {
        ...state,
        subcategories: state.subcategories.filter((sub) => sub.id !== action.payload),
        todos: state.todos.map((todo) => (todo.subcategoryId === action.payload
          ? { ...todo, subcategoryId: null }
          : todo)),
      };

    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === action.payload.id ? action.payload : todo)),
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo)),
      };

    case 'SET_GOOGLE_CALENDAR_EVENTS':
      return {
        ...state,
        googleCalendarEvents: action.payload,
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((notif) => notif.id !== action.payload),
      };

    // Data loading cases for localStorage persistence
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload || [],
      };

    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload || initialState.categories,
      };

    case 'SET_SUBCATEGORIES':
      return {
        ...state,
        subcategories: action.payload || initialState.subcategories,
      };

    case 'SET_GOOGLECALENDAREVENTS':
      return {
        ...state,
        googleCalendarEvents: action.payload || [],
      };

    default:
      return state;
  }
};

const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load todos
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
          const todos = JSON.parse(storedTodos);
          dispatch({ type: 'SET_TODOS', payload: todos });
        }

        // Load categories
        const storedCategories = localStorage.getItem('categories');
        if (storedCategories) {
          const categories = JSON.parse(storedCategories);
          dispatch({ type: 'SET_CATEGORIES', payload: categories });
        }

        // Load subcategories
        const storedSubcategories = localStorage.getItem('subcategories');
        if (storedSubcategories) {
          const subcategories = JSON.parse(storedSubcategories);
          dispatch({ type: 'SET_SUBCATEGORIES', payload: subcategories });
        }

        // Load Google Calendar events
        const storedEvents = localStorage.getItem('googleCalendarEvents');
        if (storedEvents) {
          const events = JSON.parse(storedEvents);
          dispatch({ type: 'SET_GOOGLECALENDAREVENTS', payload: events });
        }

        setIsInitialized(true);
      } catch (error) {
        setIsInitialized(true);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem('todos', JSON.stringify(state.todos));
      localStorage.setItem('categories', JSON.stringify(state.categories));
      localStorage.setItem('subcategories', JSON.stringify(state.subcategories));
      localStorage.setItem(
        'googleCalendarEvents',
        JSON.stringify(state.googleCalendarEvents),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving data to localStorage:', error);
    }
  }, [state, isInitialized]);

  // Check for due tasks and create notifications
  useEffect(() => {
    const checkDueTasks = () => {
      const now = moment();
      const dueTasks = state.todos.filter((todo) => !todo.completed && todo.deadline && moment(
        todo.deadline,
      ).isAfter(now));

      dueTasks.forEach((todo) => {
        const deadline = moment(todo.deadline);
        const timeUntilDeadline = deadline.diff(now, 'hours', true);

        if (timeUntilDeadline <= 1 && timeUntilDeadline > 0) {
          // Due in 1 hour
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: uuidv4(),
              type: 'urgent',
              message: `Task "${todo.title}" is due in 1 hour!`,
              todoId: todo.id,
              timestamp: Date.now(),
            },
          });
        } else if (timeUntilDeadline <= 6 && timeUntilDeadline > 1) {
          // Due in 6 hours
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: uuidv4(),
              type: 'warning',
              message: `Task "${todo.title}" is due in 6 hours!`,
              todoId: todo.id,
              timestamp: Date.now(),
            },
          });
        } else if (timeUntilDeadline <= 24 && timeUntilDeadline > 6) {
          // Due in 1 day
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: uuidv4(),
              type: 'info',
              message: `Task "${todo.title}" is due tomorrow!`,
              todoId: todo.id,
              timestamp: Date.now(),
            },
          });
        }
      });
    };

    const interval = setInterval(checkDueTasks, 60000); // Check every minute
    checkDueTasks(); // Check immediately

    return () => clearInterval(interval);
  }, [state.todos]);

  const addTodo = (todo) => {
    const newTodo = {
      ...todo,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_TODO', payload: newTodo });
  };

  const updateTodo = (updatedTodo) => {
    dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
  };

  const deleteTodo = (todoId) => {
    dispatch({ type: 'DELETE_TODO', payload: todoId });
  };

  const toggleTodo = (todoId) => {
    dispatch({ type: 'TOGGLE_TODO', payload: todoId });
  };

  const addCategory = (name) => {
    const newCategory = {
      id: Date.now().toString(),
      name,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const updateCategory = (updatedCategory) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
  };

  const deleteCategory = (categoryId) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
  };

  const addSubcategory = (categoryId, name) => {
    const newSubcategory = {
      id: Date.now().toString(),
      name,
      categoryId,
    };
    dispatch({ type: 'ADD_SUBCATEGORY', payload: newSubcategory });
  };

  const updateSubcategory = (updatedSubcategory) => {
    dispatch({ type: 'UPDATE_SUBCATEGORY', payload: updatedSubcategory });
  };

  const deleteSubcategory = (subcategoryId) => {
    dispatch({ type: 'DELETE_SUBCATEGORY', payload: subcategoryId });
  };

  const setGoogleCalendarEvents = (events) => {
    dispatch({ type: 'SET_GOOGLECALENDAREVENTS', payload: events });
  };

  const getTodosByCategory = () => {
    const grouped = {};
    state.categories.forEach((category) => {
      const categoryTodos = state.todos.filter(
        (todo) => todo.categoryId === category.id,
      );
      const subcategoryGroups = {};

      state.subcategories
        .filter((sub) => sub.categoryId === category.id)
        .forEach((subcategory) => {
          const subTodos = categoryTodos.filter(
            (todo) => todo.subcategoryId === subcategory.id,
          );
          if (subTodos.length > 0) {
            subcategoryGroups[subcategory.id] = {
              subcategory,
              todos: subTodos,
            };
          }
        });

      const uncategorizedTodos = categoryTodos.filter(
        (todo) => !todo.subcategoryId,
      );

      grouped[category.id] = {
        category,
        subcategories: subcategoryGroups,
        todos: uncategorizedTodos,
      };
    });
    return grouped;
  };

  const getDueTasks = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return state.todos.filter((todo) => {
      if (!todo.deadline || todo.completed) return false;
      const deadline = new Date(todo.deadline);
      return deadline >= now && deadline <= tomorrow;
    });
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return state.todos.filter((todo) => {
      if (!todo.deadline || todo.completed) return false;
      return new Date(todo.deadline) < now;
    });
  };

  const value = {
    state,
    todos: state.todos,
    categories: state.categories,
    subcategories: state.subcategories,
    googleCalendarEvents: state.googleCalendarEvents,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    setGoogleCalendarEvents,
    getTodosByCategory,
    getDueTasks,
    getOverdueTasks,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

TodoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

export { TodoContext, TodoProvider, useTodo };
