import moment from 'moment';

// Google Calendar API configuration
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar';

class GoogleCalendarService {
  constructor() {
    this.gapi = null;
    this.isInitialized = false;
    this.isSignedIn = false;
  }

  async initialize() {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
      throw new Error('client_id and scope must both be provided to initialize OAuth. Set REACT_APP_GOOGLE_CLIENT_ID and REACT_APP_GOOGLE_API_KEY.');
    }
    return new Promise((resolve, reject) => {
      if (this.isInitialized) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        if (!window.gapi) { reject(new Error('Google API failed to load')); return; }
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: GOOGLE_API_KEY,
              clientId: GOOGLE_CLIENT_ID,
              discoveryDocs: DISCOVERY_DOCS,
              scope: SCOPES,
            });
            this.gapi = window.gapi;
            this.isInitialized = true;
            this.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
            this.updateSigninStatus(this.gapi.auth2.getAuthInstance().isSignedIn.get());
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  updateSigninStatus(isSignedIn) {
    this.isSignedIn = isSignedIn;
  }

  async signIn() {
    if (!this.isInitialized) await this.initialize();
    try {
      const auth = this.gapi?.auth2?.getAuthInstance();
      if (!auth) throw new Error('Google Auth instance not available');
      await auth.signIn();
      return true;
    } catch (error) {
      return false;
    }
  }

  async signOut() {
    try {
      if (this.gapi && this.gapi.auth2) {
        await this.gapi.auth2.getAuthInstance().signOut();
        this.isSignedIn = false;
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async getCalendarEvents(calendarId = 'primary', timeMin = null, timeMax = null) {
    if (!this.isSignedIn) throw new Error('User not signed in');
    const now = moment();
    const startTime = timeMin || now.startOf('day').toISOString();
    const endTime = timeMax || now.add(30, 'days').endOf('day').toISOString();
    const response = await this.gapi.client.calendar.events.list({
      calendarId,
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.result.items.map((event) => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description || '',
      startTime: event.start.dateTime || event.start.date,
      endTime: event.end.dateTime || event.end.date,
      location: event.location || '',
      attendees: event.attendees || [],
      isAllDay: !event.start.dateTime,
    }));
  }

  async addEventToCalendar(eventData) {
    if (!this.isSignedIn) throw new Error('User not signed in');
    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.startTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: eventData.endTime || moment(eventData.startTime).add(1, 'hour').toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    };
    if (eventData.location) event.location = eventData.location;
    const response = await this.gapi.client.calendar.events.insert({ calendarId: 'primary', resource: event });
    return response.result;
  }

  async updateEvent(eventId, eventData) {
    if (!this.isSignedIn) throw new Error('User not signed in');
    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.startTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: eventData.endTime || moment(eventData.startTime).add(1, 'hour').toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
    if (eventData.location) event.location = eventData.location;
    const response = await this.gapi.client.calendar.events.update({ calendarId: 'primary', eventId, resource: event });
    return response.result;
  }

  async deleteEvent(eventId) {
    if (!this.isSignedIn) throw new Error('User not signed in');
    await this.gapi.client.calendar.events.delete({ calendarId: 'primary', eventId });
    return true;
  }

  // Convert todo to calendar event
  static todoToCalendarEvent(todo) {
    return {
      summary: todo.title,
      description: todo.description || '',
      start: {
        dateTime: todo.deadline || new Date().toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: todo.deadline
          ? new Date(new Date(todo.deadline).getTime() + 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      location: todo.location || '',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };
  }

  // Convert calendar event to todo
  static calendarEventToTodo(event) {
    return {
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description || '',
      deadline: event.start?.dateTime || event.start?.date || null,
      location: event.location || '',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
    };
  }
}

export default GoogleCalendarService;
