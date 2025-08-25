# Configuration Guide

This guide will help you set up all the external services and environment variables needed for the advanced todo application.

## Environment Variables Setup

Create a `.env` file in the root directory of your project with the following variables:

```env
# Google Calendar API Configuration
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
REACT_APP_GOOGLE_API_KEY=your_google_api_key_here

# EmailJS Configuration (Optional - for email notifications)
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
REACT_APP_EMAILJS_USER_ID=your_emailjs_user_id_here
```

## Google Calendar API Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing (required for API usage)

### Step 2: Enable Google Calendar API
1. Navigate to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure OAuth consent screen if prompted
4. Set application type to "Web application"
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
7. Copy the Client ID

### Step 4: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API Key
4. (Optional) Restrict the API key to Google Calendar API only

### Step 5: Update Environment Variables
```env
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
REACT_APP_GOOGLE_API_KEY=AIzaSyBcDefGhIjKlMnOpQrStUvWxYz123456789
```

## EmailJS Setup (Optional)

### Step 1: Sign Up
1. Go to [EmailJS](https://www.emailjs.com/)
2. Create a free account

### Step 2: Add Email Service
1. Go to "Email Services" in your dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Copy the Service ID

### Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Design your notification email
4. Use these variables in your template:
   - `{{to_email}}` - recipient email
   - `{{subject}}` - email subject
   - `{{message}}` - email message
5. Copy the Template ID

### Step 4: Get User ID
1. Go to "Account" > "API Keys"
2. Copy your Public Key (User ID)

### Step 5: Update Environment Variables
```env
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_USER_ID=user_def456
```

## Testing Your Setup

### Test Google Calendar Integration
1. Start your development server: `npm start`
2. Go to the Google Calendar Integration section
3. Click "Sign in with Google"
4. Grant permissions to your app
5. Try importing/exporting calendar events

### Test Email Notifications
1. Go to Notification Settings
2. Enable email notifications
3. Enter your email address
4. Click "Test Email"
5. Check your inbox for the test email

## Troubleshooting

### Common Issues

#### Google Calendar API Errors
- **"API not enabled"**: Make sure Google Calendar API is enabled in your project
- **"Invalid credentials"**: Check your Client ID and API Key
- **"Origin not allowed"**: Verify your authorized origins in OAuth settings

#### EmailJS Errors
- **"Service not found"**: Check your Service ID
- **"Template not found"**: Check your Template ID
- **"User not found"**: Check your User ID
- **"Email not sent"**: Verify your email service configuration

#### Notification Permission Issues
- **"Notifications blocked"**: Check browser settings
- **"Permission denied"**: User must manually enable in browser
- **"Not supported"**: Some browsers don't support notifications

### Debug Mode
Enable debug logging by adding this to your `.env` file:
```env
REACT_APP_DEBUG=true
```

## Security Notes

- **Never commit your `.env` file** to version control
- **Restrict API keys** to only the services you need
- **Use environment variables** for all sensitive configuration
- **Monitor API usage** to avoid unexpected charges
- **Regularly rotate** your API keys

## Production Deployment

When deploying to production:

1. **Update OAuth origins** to include your production domain
2. **Set production environment variables** in your hosting platform
3. **Enable HTTPS** (required for OAuth)
4. **Test all integrations** in production environment
5. **Monitor error logs** for any issues

## Support

If you continue to have issues:

1. Check the [Google Cloud Console](https://console.cloud.google.com/) for API errors
2. Review [EmailJS documentation](https://www.emailjs.com/docs/)
3. Check browser console for JavaScript errors
4. Verify all environment variables are set correctly
5. Ensure your Google Cloud project has billing enabled


