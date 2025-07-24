# Email Setup Guide - Contact Form Integration

## Overview
This guide will help you set up the contact form to send emails directly to your email address when someone fills out the contact form on your portfolio website.

## Prerequisites
- Gmail account (or other SMTP email provider)
- Next.js application with contact form

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled

### Step 2: Generate App Password
1. In Google Account settings, go to "Security"
2. Under "2-Step Verification", click "App passwords"
3. Select "Mail" and "Other (custom name)"
4. Enter "Portfolio Contact Form" as the custom name
5. Click "Generate"
6. Copy the 16-character app password (something like: `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables
Open your `.env.local` file and update these variables:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password you generated

## Other Email Providers

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo Mail
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### Custom SMTP Server
```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-password
```

## Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your contact section on the website

3. Fill out the contact form with test data:
   - Name: Test User
   - Email: test@example.com
   - Message: This is a test message

4. Click "Submit"

5. Check your email inbox for:
   - The contact form submission (sent to your email)
   - Auto-reply confirmation (sent to the form submitter)

## Features Included

### For You (Website Owner)
- Receive formatted email with contact details
- Clean HTML template with sender information
- Timestamp of when the message was sent
- All form data (name, email, message) included

### For Form Submitters
- Auto-reply confirmation email
- Professional thank you message
- Copy of their submitted message
- Your contact information for direct follow-up

## Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Make sure you're using an app password, not your regular Gmail password
   - Verify 2-factor authentication is enabled

2. **"Connection timeout" error**
   - Check your SMTP_HOST and SMTP_PORT settings
   - Ensure your firewall allows outbound connections on port 587

3. **Emails not being sent**
   - Verify all environment variables are set correctly
   - Check the server console for error messages
   - Make sure nodemailer is installed: `npm install nodemailer @types/nodemailer`

4. **Emails going to spam**
   - This is normal for development environments
   - In production, consider using a dedicated email service like SendGrid, Mailgun, or AWS SES

### Production Deployment

For production environments, consider using dedicated email services:

- **SendGrid**: More reliable, better deliverability
- **Mailgun**: Good for transactional emails
- **AWS SES**: Cost-effective for high volume
- **Resend**: Modern email API with great developer experience

## Security Notes

- Never commit your `.env.local` file to version control
- Use app passwords instead of regular passwords
- Consider rate limiting for production applications
- Validate and sanitize all form inputs (already implemented)

## File Structure

```
src/
├── app/
│   └── api/
│       └── contact/
│           └── route.ts          # Email sending API endpoint
└── components/
    └── sections/
        └── ContactProject.tsx    # Contact form component
```

The contact form is now fully functional and will send emails directly to your specified email address!
