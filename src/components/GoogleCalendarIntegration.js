import React, { useState, useEffect } from 'react';
import GoogleCalendarService from '../services/googleCalendarService';
import './GoogleCalendarIntegration.css';

const GoogleCalendarIntegration = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [calendarService] = useState(() => new GoogleCalendarService());

  useEffect(() => {
    const initializeService = async () => {
      try {
        await calendarService.initialize();
        setIsSignedIn(calendarService.isSignedIn);
      } catch (err) {
        setError('Failed to initialize Google Calendar service');
        console.error('Initialization error:', err);
      }
    };

    initializeService();
  }, [calendarService]);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await calendarService.signIn();
      if (success) {
        setIsSignedIn(true);
        await loadEvents();
      } else {
        setError('Failed to sign in to Google Calendar');
      }
    } catch (err) {
      setError('Error signing in to Google Calendar');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await calendarService.signOut();
      setIsSignedIn(false);
      setEvents([]);
    } catch (err) {
      setError('Error signing out from Google Calendar');
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const calendarEvents = await calendarService.getCalendarEvents();
      setEvents(calendarEvents);
    } catch (err) {
      setError('Failed to load calendar events');
      console.error('Load events error:', err);
    }
  };

  const formatEventTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleString();
  };

  return (
    <div className="calendar-integration">
      <div className="integration-header">
        <h3>
          <span className="google-icon">📅</span>
          Google Calendar Integration
        </h3>
        {isSignedIn && (
          <button
            className="sign-out-btn"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <span>🚪</span>
            Sign Out
          </button>
        )}
      </div>

      <div className="integration-content">
        {!isSignedIn ? (
          <div>
            <p>
              Connect your Google Calendar to view and manage your events alongside your todos.
            </p>
            <button
              className="sign-in-btn"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              <span>🔑</span>
              {isLoading ? 'Signing In...' : 'Sign In with Google'}
            </button>
          </div>
        ) : (
          <div>
            <p>Successfully connected to Google Calendar!</p>
            <button
              className="sign-in-btn"
              onClick={loadEvents}
              disabled={isLoading}
              style={{ marginBottom: '20px' }}
            >
              <span>🔄</span>
              {isLoading ? 'Loading...' : 'Refresh Events'}
            </button>
          </div>
        )}

        {error && (
          <div style={{ color: '#dc2626', marginTop: '16px' }}>
            {error}
          </div>
        )}

        {isSignedIn && events.length > 0 && (
          <div className="integration-actions">
            <h4 style={{ width: '100%', marginBottom: '16px' }}>Upcoming Events:</h4>
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                style={{
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <h5 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
                  {event.title}
                </h5>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280' }}>
                  {formatEventTime(event.startTime)}
                </p>
                {event.location && (
                  <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                    📍 {event.location}
                  </p>
                )}
              </div>
            ))}
            {events.length > 5 && (
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
                Showing 5 of {events.length} events
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCalendarIntegration;
