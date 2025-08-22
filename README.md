# Advanced Todo Application with React

A feature-rich, modern todo application built with React that includes categories, subcategories, deadlines, Google Calendar integration, and comprehensive notification systems.

## ✨ Features

### 🎯 Task Management
- **Categories & Subcategories**: Organize tasks with customizable categories and subcategories
- **Priority Levels**: Set low, medium, or high priority for tasks
- **Deadlines**: Add due dates and times with visual countdown indicators
- **Location Support**: Add location information to tasks
- **Rich Descriptions**: Add detailed descriptions to tasks
- **Task Editing**: Full inline editing capabilities for all task properties

### 📅 Google Calendar Integration
- **Import Events**: Import calendar events as tasks
- **Export Tasks**: Add tasks to Google Calendar
- **Bidirectional Sync**: Seamless integration between tasks and calendar
- **OAuth Authentication**: Secure Google account connection

### 🔔 Notification System
- **Desktop Notifications**: Browser-based desktop notifications
- **Email Notifications**: Email alerts for due tasks
- **Smart Timing**: Notifications at 1 day, 6 hours, and 1 hour before deadline
- **Overdue Alerts**: Special notifications for overdue tasks
- **Sound Alerts**: Audio notifications for enhanced user experience

### 📱 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Beautiful, modern interface
- **Drag & Drop**: Intuitive task organization
- **Search & Filter**: Find tasks quickly with advanced filtering
- **Visual Indicators**: Color-coded categories and priority levels

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Google Cloud Platform account (for Calendar integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd To-do-app-with-React
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Google Calendar API
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   REACT_APP_GOOGLE_API_KEY=your_google_api_key
   
   # EmailJS (for email notifications)
   REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   REACT_APP_EMAILJS_USER_ID=your_emailjs_user_id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Google Calendar Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Calendar API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add authorized JavaScript origins: `http://localhost:3000`
   - Add authorized redirect URIs: `http://localhost:3000`

4. **Get API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

5. **Update environment variables**
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=your_oauth_client_id
   REACT_APP_GOOGLE_API_KEY=your_api_key
   ```

### EmailJS Setup (Optional)

1. **Sign up for EmailJS**
   - Go to [EmailJS](https://www.emailjs.com/) and create an account

2. **Create Email Service**
   - Add your email service (Gmail, Outlook, etc.)

3. **Create Email Template**
   - Create a template for task notifications

4. **Get Service Details**
   - Copy your service ID, template ID, and user ID

5. **Update environment variables**
   ```env
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
   REACT_APP_EMAILJS_USER_ID=your_user_id
   ```

## 📱 Usage

### Adding Tasks
1. **Basic Task**: Enter task title and click "Add Task"
2. **Detailed Task**: Fill in description, category, subcategory, deadline, priority, and location
3. **Calendar Integration**: Check "Add to Google Calendar" to sync with Google Calendar

### Managing Categories
1. **Add Category**: Click the "+" button next to category dropdown
2. **Customize**: Choose name and color for each category
3. **Organize**: Create subcategories within main categories

### Setting Up Notifications
1. **Desktop Notifications**: Click "Request Permission" to enable
2. **Email Notifications**: Enter your email and enable email alerts
3. **Timing**: Configure when you want to receive notifications
4. **Test**: Use test buttons to verify notification setup

### Google Calendar Integration
1. **Sign In**: Click "Sign in with Google" to connect your account
2. **Import Events**: Import calendar events as tasks
3. **Export Tasks**: Add tasks to your Google Calendar
4. **Sync**: Keep tasks and calendar in sync

## 🏗️ Project Structure

```
src/
├── components/                 # React components
│   ├── Header.js             # Application header
│   ├── InputTodo.js          # Task input form
│   ├── TodoContainer.js      # Main task container
│   ├── TodoItem.js           # Individual task item
│   ├── GoogleCalendarIntegration.js  # Calendar integration
│   ├── NotificationSettings.js       # Notification settings
│   └── Navbar.js             # Navigation bar
├── context/                   # React context
│   └── TodoContext.js        # Global state management
├── services/                  # External services
│   ├── googleCalendarService.js  # Google Calendar API
│   └── notificationService.js    # Notification handling
├── pages/                     # Page components
│   ├── About.js              # About page
│   └── NotMatch.js           # 404 page
└── App.js                     # Main application component
```

## 🎨 Customization

### Styling
- All components use CSS modules for scoped styling
- Responsive design with mobile-first approach
- Easy to customize colors, fonts, and layouts

### Adding New Features
- Modular component architecture
- Context-based state management
- Service-oriented design for external integrations

## 🔒 Security

- OAuth 2.0 for Google Calendar integration
- Environment variables for sensitive configuration
- No sensitive data stored in localStorage
- Secure API key handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Push code to GitHub
2. Connect repository to Netlify/Vercel
3. Set environment variables in deployment platform
4. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/To-do-app-with-React/issues) page
2. Create a new issue with detailed description
3. Include browser version and error messages

## 🔮 Future Enhancements

- [ ] Dark mode toggle
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Team collaboration
- [ ] Mobile app
- [ ] Offline support
- [ ] Data export/import
- [ ] Advanced analytics

## 🙏 Acknowledgments

- React team for the amazing framework
- Google for Calendar API
- EmailJS for email service
- All contributors and users

---

**Happy Tasking! 🎉**


