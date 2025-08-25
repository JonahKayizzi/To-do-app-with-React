import React, { useState, useEffect, useCallback } from 'react';
import {
  FaCalendarAlt, FaSignInAlt, FaSignOutAlt, FaSync, FaPlus,
} from 'react-icons/fa';
import './GoogleCalendarIntegration.css';

const GoogleCalendarIntegration = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [calendarService, setCalendarService] = useState(null);

  const loadEvents = useCallback(async () => {
    if (!calendarService) return;

    try {
      setIsLoading(true);
      setError(null);
      const calendarEvents = await calendarService.getEvents();
      setEvents(calendarEvents);
    } catch (err) {
      setError('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  }, [calendarService]);

  useEffect(() => {
    const initService = async () => {
      try {
        const { GoogleCalendarService } = await import('../services/googleCalendarService');
        const service = new GoogleCalendarService();
        setCalendarService(service);

        // Check if user is already signed in
        const signedIn = await service.isSignedIn();
        setIsSignedIn(signedIn);

        if (signedIn) {
          loadEvents();
        }
      } catch (err) {
        setError('Failed to initialize Google Calendar service');
      }
    };

    initService();
  }, [loadEvents]);

  const handleSignIn = async () => {
    if (!calendarService) return;

    try {
      setIsLoading(true);
      setError(null);
      await calendarService.signIn();
      setIsSignedIn(true);
      await loadEvents();
    } catch (err) {
      setError('Failed to sign in to Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!calendarService) return;

    try {
      setIsLoading(true);
      setError(null);
      await calendarService.signOut();
      setIsSignedIn(false);
      setEvents([]);
    } catch (err) {
      setError('Failed to sign out from Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!calendarService) return;

    try {
      setIsLoading(true);
      setError(null);
      // Example: Add a new event
      const newEvent = {
        title: 'New Task',
        description: 'Task description',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // Tomorrow + 1 hour
      };

      await calendarService.addEvent(newEvent);
      await loadEvents(); // Refresh events
    } catch (err) {
      setError('Failed to add calendar event');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEvents = () => {
    if (isLoading) {
      return <p>Loading events...</p>;
    }
    if (events.length > 0) {
      return (
        <ul className="events-list">
          {events.map((event) => (
            <li key={`${event.title}-${event.startTime}`} className="event-item">
              <strong>{event.title}</strong>
              {event.description && <p>{event.description}</p>}
              <small>
                {new Date(event.startTime).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      );
    }
    return <p>No upcoming events</p>;
  };

  if (!calendarService) {
    return (
      <div className="calendar-integration">
        <div className="calendar-header">
          <FaCalendarAlt />
          <h3>Google Calendar</h3>
        </div>
        <div className="calendar-content">
          <p>Initializing calendar service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-integration">
      <div className="calendar-header">
        <FaCalendarAlt />
        <h3>Google Calendar</h3>
      </div>

      <div className="calendar-content">
        {error && (
          <div className="calendar-error">
            <p>{error}</p>
          </div>
        )}

        {!isSignedIn ? (
          <div className="calendar-signin">
            <p>Connect your Google Calendar to sync tasks and events</p>
            <button
              type="button"
              className="calendar-btn primary"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              <FaSignInAlt />
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        ) : (
          <div className="calendar-signedin">
            <div className="calendar-controls">
              <button
                type="button"
                className="calendar-btn secondary"
                onClick={loadEvents}
                disabled={isLoading}
              >
                <FaSync />
                Refresh
              </button>
              <button
                type="button"
                className="calendar-btn primary"
                onClick={handleAddEvent}
                disabled={isLoading}
              >
                <FaPlus />
                Add Event
              </button>
              <button
                type="button"
                className="calendar-btn secondary"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>

            <div className="calendar-events">
              <h4>Upcoming Events</h4>
              {renderEvents()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCalendarIntegration;
