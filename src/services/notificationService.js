import emailjs from '@emailjs/browser';

class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.emailjsInitialized = false;
  }

  async requestPermission() {
    if (!this.isSupported) return false;
    if (this.permission === 'default') {
      this.permission = await Notification.requestPermission();
    }
    return this.permission === 'granted';
  }

  async showDesktopNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted') return false;
    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: true,
        ...options,
      });
      setTimeout(() => notification.close(), 10000);
      return notification;
    } catch (error) {
      console.error('Error showing desktop notification:', error);
      return false;
    }
  }

  async showTaskDueNotification(task, timeUntilDue) {
    let title; let body; const icon = '/favicon.ico';
    if (timeUntilDue <= 1) {
      title = '🚨 Task Due in 1 Hour!';
      body = `"${task.title}" is due very soon!`;
    } else if (timeUntilDue <= 6) {
      title = '⚠️ Task Due in 6 Hours!';
      body = `"${task.title}" is due soon!`;
    } else if (timeUntilDue <= 24) {
      title = '📅 Task Due Tomorrow!';
      body = `"${task.title}" is due tomorrow!`;
    }
    if (title && body) {
      await this.showDesktopNotification(title, {
        body, icon, tag: `task-${task.id}`, data: { taskId: task.id },
      });
    }
  }

  ensureEmailEnv() {
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const userId = process.env.REACT_APP_EMAILJS_USER_ID;
    if (!serviceId || !templateId || !userId) {
      throw new Error('EmailJS environment variables missing. Please set REACT_APP_EMAILJS_SERVICE_ID, REACT_APP_EMAILJS_TEMPLATE_ID, REACT_APP_EMAILJS_USER_ID');
    }
    return { serviceId, templateId, userId };
  }

  async sendEmailNotification(to, subject, message) {
    try {
      const { serviceId, templateId, userId } = this.ensureEmailEnv();
      if (!this.emailjsInitialized) {
        emailjs.init(userId);
        this.emailjsInitialized = true;
      }
      const templateParams = { to_email: to, subject, message };
      await emailjs.send(serviceId, templateId, templateParams);
      return true;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  async sendTaskDueEmail(task, timeUntilDue, userEmail) {
    let subject; let message;
    if (timeUntilDue <= 1) {
      subject = '🚨 Task Due in 1 Hour!';
      message = `Your task "${task.title}" is due in 1 hour. Please complete it as soon as possible.`;
    } else if (timeUntilDue <= 6) {
      subject = '⚠️ Task Due in 6 Hours!';
      message = `Your task "${task.title}" is due in 6 hours. Please plan accordingly.`;
    } else if (timeUntilDue <= 24) {
      subject = '📅 Task Due Tomorrow!';
      message = `Your task "${task.title}" is due tomorrow. Please prepare for it.`;
    }
    if (!subject || !message) return false;
    return this.sendEmailNotification(userEmail, subject, message);
  }

  showBrowserNotification(title, options = {}) {
    if (!this.isSupported) return false;
    try {
      return new Notification(title, { icon: '/favicon.ico', badge: '/favicon.ico', ...options });
    } catch (error) {
      console.error('Error showing browser notification:', error);
      return false;
    }
  }

  playNotificationSound() {
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (_) {}
  }

  showToastNotification(message, type = 'info') {
    const event = new CustomEvent('showToast', { detail: { message, type } });
    window.dispatchEvent(event);
  }

  isNotificationsEnabled() {
    return this.isSupported && this.permission === 'granted';
  }

  getPermissionStatus() {
    return this.permission;
  }
}

export default new NotificationService();
