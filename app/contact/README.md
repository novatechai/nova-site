# Nova Labs Contact Page

This is a modern, interactive contact page for Nova Labs built with Next.js, Shadcn/UI, and Motion.js.

## Features

- **Dual-function Contact Form**: Users can either schedule a meeting or send a simple message
- **Meeting Scheduling**: Calendar and time slot selection similar to Calendly/Cal.com
- **Form Validation**: Built with React Hook Form and Zod validation
- **Responsive Design**: Works on all device sizes
- **Smooth Animations**: Uses Motion.js for fluid transitions
- **Temporary Local Storage**: Saves form submissions to localStorage for demo purposes

## Components

- `/app/contact/page.tsx`: Main contact page component
- `/lib/validators/contact-form.ts`: Form validation schema and utility functions
- `/app/admin/contact/page.tsx`: Admin view to see stored contact requests

## Future Integration

Currently, the contact form stores data in browser localStorage. In a production environment, this would be connected to:

1. A database (e.g., PostgreSQL, MongoDB, Supabase)
2. An email service to send confirmation emails to users
3. Integration with a calendar service like Google Calendar or Microsoft Outlook
4. Admin authentication for the admin view

## Usage

Navigate to the contact page and either:
1. Schedule a meeting by filling out the form and selecting a date/time
2. Send a message using the message form

To view submissions, go to the admin page at `/admin/contact`.

## Contact Email

All contact requests will eventually be sent to `contact@gonova.com` 