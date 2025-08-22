import React, { useState, useEffect } from 'react';
import {
  FaBell, FaEnvelope, FaDesktop, FaCog, FaCheck, FaTimes,
} from 'react-icons/fa';
import notificationService from '../services/notificationService';
import './NotificationSettings.css';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    desktopNotifications: false,
    emailNotifications: false,
    soundNotifications: true,
    due1Day: true,
    due6Hours: true,
    due1Hour: true,
    overdue: true,
  });

  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [testNotification, setTestNotification] = useState('');

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load saved email
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage whenever they change
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    // Save email to localStorage whenever it changes
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    }
  }, [userEmail]);

  const handleSettingChange = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Desktop notifications are not supported in this browser.');
      return;
    }

    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        setSettings((prev) => ({ ...prev, desktopNotifications: true }));
        alert('Desktop notifications enabled!');
      } else {
        setSettings((prev) => ({ ...prev, desktopNotifications: false }));
        alert('Desktop notifications were denied.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      alert('Failed to enable desktop notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  const testDesktopNotification = async () => {
    if (notificationPermission !== 'granted') {
      alert('Please enable desktop notifications first.');
      return;
    }

    try {
      await notificationService.showDesktopNotification(
        'Test Notification',
        'This is a test notification from your Todo app!',
      );
      setTestNotification('Desktop notification sent successfully!');
      setTimeout(() => setTestNotification(''), 3000);
    } catch (error) {
      setTestNotification('Failed to send desktop notification.');
      setTimeout(() => setTestNotification(''), 3000);
    }
  };

  const testEmailNotification = async () => {
    if (!userEmail) {
      alert('Please enter your email address first.');
      return;
    }

    if (!settings.emailNotifications) {
      alert('Please enable email notifications first.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await notificationService.sendTaskDueEmail(
        { title: 'Test Task' },
        24, // 1 day
        userEmail,
      );

      if (success) {
        setTestNotification('Test email sent successfully!');
      } else {
        setTestNotification('Failed to send test email.');
      }
    } catch (error) {
      setTestNotification('Failed to send test email.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setTestNotification(''), 3000);
    }
  };

  const getNotificationStatus = () => {
    if (!('Notification' in window)) {
      return { status: 'unsupported', text: 'Not supported', color: '#6b7280' };
    }

    switch (notificationPermission) {
      case 'granted':
        return { status: 'enabled', text: 'Enabled', color: '#10b981' };
      case 'denied':
        return { status: 'denied', text: 'Denied', color: '#ef4444' };
      default:
        return { status: 'default', text: 'Not set', color: '#f59e0b' };
    }
  };

  const notificationStatus = getNotificationStatus();

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <FaBell className="settings-icon" />
        <h3>Notification Settings</h3>
      </div>

      <div className="settings-content">
        {/* Desktop Notifications */}
        <div className="setting-section">
          <div className="setting-header">
            <FaDesktop className="setting-icon" />
            <h4>Desktop Notifications</h4>
            <span className={`status-badge ${notificationStatus.status}`}>
              {notificationStatus.text}
            </span>
          </div>

          <div className="setting-controls">
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={settings.desktopNotifications && notificationPermission === 'granted'}
                onChange={() => {}}
                disabled={notificationPermission !== 'granted'}
              />
              <span className="toggle-slider" />
              Enable desktop notifications
            </label>

            {notificationPermission !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                disabled={isLoading}
                className="permission-btn"
              >
                {isLoading ? 'Requesting...' : 'Request Permission'}
              </button>
            )}

            {notificationPermission === 'granted' && (
              <button
                onClick={testDesktopNotification}
                className="test-btn"
              >
                Test Notification
              </button>
            )}
          </div>
        </div>

        {/* Email Notifications */}
        <div className="setting-section">
          <div className="setting-header">
            <FaEnvelope className="setting-icon" />
            <h4>Email Notifications</h4>
          </div>

          <div className="setting-controls">
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleSettingChange('emailNotifications')}
              />
              <span className="toggle-slider" />
              Enable email notifications
            </label>

            {settings.emailNotifications && (
              <div className="email-input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={userEmail}
                  onChange={handleEmailChange}
                  className="email-input"
                />
                <button
                  onClick={testEmailNotification}
                  disabled={isLoading || !userEmail}
                  className="test-btn"
                >
                  {isLoading ? 'Sending...' : 'Test Email'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sound Notifications */}
        <div className="setting-section">
          <div className="setting-header">
            <FaCog className="setting-icon" />
            <h4>Sound & Alerts</h4>
          </div>

          <div className="setting-controls">
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={settings.soundNotifications}
                onChange={() => handleSettingChange('soundNotifications')}
              />
              <span className="toggle-slider" />
              Play sound for notifications
            </label>
          </div>
        </div>

        {/* Notification Timing */}
        <div className="setting-section">
          <div className="setting-header">
            <FaBell className="setting-icon" />
            <h4>Notification Timing</h4>
          </div>

          <div className="timing-controls">
            <label className="timing-toggle">
              <input
                type="checkbox"
                checked={settings.due1Day}
                onChange={() => handleSettingChange('due1Day')}
              />
              <span className="toggle-slider" />
              Notify 1 day before deadline
            </label>

            <label className="timing-toggle">
              <input
                type="checkbox"
                checked={settings.due6Hours}
                onChange={() => handleSettingChange('due6Hours')}
              />
              <span className="toggle-slider" />
              Notify 6 hours before deadline
            </label>

            <label className="timing-toggle">
              <input
                type="checkbox"
                checked={settings.due1Hour}
                onChange={() => handleSettingChange('due1Hour')}
              />
              <span className="toggle-slider" />
              Notify 1 hour before deadline
            </label>

            <label className="timing-toggle">
              <input
                type="checkbox"
                checked={settings.overdue}
                onChange={() => handleSettingChange('overdue')}
              />
              <span className="toggle-slider" />
              Notify for overdue tasks
            </label>
          </div>
        </div>

        {/* Test Notification Result */}
        {testNotification && (
          <div className={`test-result ${testNotification.includes('successfully') ? 'success' : 'error'}`}>
            {testNotification.includes('successfully') ? (
              <FaCheck className="result-icon" />
            ) : (
              <FaTimes className="result-icon" />
            )}
            <span>{testNotification}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings;
