import React, {
  createContext, useContext, useReducer, useEffect, useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

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
        categories: state.categories.map((cat) => (cat.id === action.payload.id ? action.payload : cat)),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
        subcategories: state.subcategories.filter((sub) => sub.categoryId !== action.payload),
        todos: state.todos.map((todo) => (todo.categoryId === action.payload ? { ...todo, categoryId: null, subcategoryId: null } : todo)),
      };

    case 'ADD_SUBCATEGORY':
      return {
        ...state,
        subcategories: [...state.subcategories, action.payload],
      };

    case 'UPDATE_SUBCATEGORY':
      return {
        ...state,
        subcategories: state.subcategories.map((sub) => (sub.id === action.payload.id ? action.payload : sub)),
      };

    case 'DELETE_SUBCATEGORY':
      return {
        ...state,
        subcategories: state.subcategories.filter((sub) => sub.id !== action.payload),
        todos: state.todos.map((todo) => (todo.subcategoryId === action.payload ? { ...todo, subcategoryId: null } : todo)),
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
        todos: state.todos.map((todo) => (todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo)),
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

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('todoAppState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);

        // Load each data type individually
        if (parsedState.todos && Array.isArray(parsedState.todos)) {
          dispatch({ type: 'SET_TODOS', payload: parsedState.todos });
        }
        if (parsedState.categories && Array.isArray(parsedState.categories)) {
          dispatch({ type: 'SET_CATEGORIES', payload: parsedState.categories });
        }
        if (parsedState.subcategories && Array.isArray(parsedState.subcategories)) {
          dispatch({ type: 'SET_SUBCATEGORIES', payload: parsedState.subcategories });
        }
        if (parsedState.googleCalendarEvents && Array.isArray(parsedState.googleCalendarEvents)) {
          dispatch({ type: 'SET_GOOGLECALENDAREVENTS', payload: parsedState.googleCalendarEvents });
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('todoAppState');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save data to localStorage whenever state changes (but not during initial load)
  useEffect(() => {
    if (!isInitialized) return; // Don't save during initial load

    try {
      const stateToSave = { ...state };
      delete stateToSave.notifications; // Don't save notifications

      localStorage.setItem('todoAppState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [state, isInitialized]);

  // Check for due tasks and create notifications
  useEffect(() => {
    const checkDueTasks = () => {
      const now = moment();
      const dueTasks = state.todos.filter((todo) => !todo.completed && todo.deadline && moment(todo.deadline).isAfter(now));

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

  const value = {
    state,
    dispatch,
    addCategory: (name, color) => {
      const category = { id: uuidv4(), name, color };
      dispatch({
        type: 'ADD_CATEGORY',
        payload: category,
      });
    },
    updateCategory: (category) => {
      dispatch({ type: 'UPDATE_CATEGORY', payload: category });
    },
    deleteCategory: (id) => {
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    },
    addSubcategory: (name, categoryId) => {
      dispatch({
        type: 'ADD_SUBCATEGORY',
        payload: { id: uuidv4(), name, categoryId },
      });
    },
    updateSubcategory: (subcategory) => {
      dispatch({ type: 'UPDATE_SUBCATEGORY', payload: subcategory });
    },
    deleteSubcategory: (id) => {
      dispatch({ type: 'DELETE_SUBCATEGORY', payload: id });
    },
    addTodo: (todo) => {
      const newTodo = {
        ...todo, id: uuidv4(), completed: false, createdAt: Date.now(),
      };
      dispatch({
        type: 'ADD_TODO',
        payload: newTodo,
      });
    },
    updateTodo: (todo) => {
      dispatch({ type: 'UPDATE_TODO', payload: todo });
    },
    deleteTodo: (id) => {
      dispatch({ type: 'DELETE_TODO', payload: id });
    },
    toggleTodo: (id) => {
      dispatch({ type: 'TOGGLE_TODO', payload: id });
    },
    getTodosByCategory: () => {
      const grouped = {};
      state.categories.forEach((category) => {
        grouped[category.id] = {
          category,
          subcategories: {},
          todos: [],
        };
      });

      state.subcategories.forEach((subcategory) => {
        if (grouped[subcategory.categoryId]) {
          grouped[subcategory.categoryId].subcategories[subcategory.id] = {
            subcategory,
            todos: [],
          };
        }
      });

      state.todos.forEach((todo) => {
        if (todo.categoryId && grouped[todo.categoryId]) {
          grouped[todo.categoryId].todos.push(todo);
          if (todo.subcategoryId && grouped[todo.categoryId].subcategories[todo.subcategoryId]) {
            grouped[todo.categoryId].subcategories[todo.subcategoryId].todos.push(todo);
          }
        }
      });

      return grouped;
    },
    getDueTasks: () => {
      const now = moment();
      return state.todos.filter((todo) => !todo.completed && todo.deadline && moment(todo.deadline).isAfter(now)).sort((a, b) => moment(a.deadline).diff(moment(b.deadline)));
    },
    getOverdueTasks: () => {
      const now = moment();
      return state.todos.filter((todo) => !todo.completed && todo.deadline && moment(todo.deadline).isBefore(now)).sort((a, b) => moment(b.deadline).diff(moment(a.deadline)));
    },
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
