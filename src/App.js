import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './context/TodoContext';
import Header from './components/Header';
import TodoContainer from './components/TodoContainer';
import GoogleCalendarIntegration from './components/GoogleCalendarIntegration';
import NotificationSettings from './components/NotificationSettings';
import SummaryStatistics from './components/SummaryStatistics';
import AddTaskButton from './components/AddTaskButton';
import InputTodoModal from './components/InputTodoModal';
import NotMatch from './pages/NotMatch';
import './App.css';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app-shell">
      <Header />
      <div className="dashboard-grid">
        <div className="section-span-4 main-sections">
          <AddTaskButton onClick={openModal} />
          <SummaryStatistics />
        </div>
        <div className="section-span-4 main-sections">
          <TodoContainer />
        </div>
        <div className="section-span-4 main-sections">
          <GoogleCalendarIntegration />
          <NotificationSettings />
        </div>
      </div>

      <InputTodoModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

function App() {
  return (
    <TodoProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<NotMatch />} />
            <Route path="*" element={<NotMatch />} />
          </Routes>
        </div>
      </Router>
    </TodoProvider>
  );
}

export default App;
