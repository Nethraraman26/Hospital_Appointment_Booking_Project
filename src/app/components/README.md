# Hospital Appointment Booking System

## Default Credentials

### Admin Login
- **Username:** admin
- **Password:** admin123

## Features

### Landing Page
- Admin Login
- Patient Login
- Patient Registration

### Admin Dashboard
- Add new doctors
- Update doctor availability with toggle switch
- View and manage all appointments
- Delete appointments

### Patient Dashboard
- View profile information
- Browse available doctors
- Book appointments
- View appointment history

### Doctors Page
- View all doctors
- Filter by availability
- See doctor specializations

### Book Appointment Page
- Select from available doctors only
- Choose date (from today onwards)
- View and select only available time slots (10 AM - 4 PM)
- Automatic validation to prevent double booking
- Shows alerts when slots are unavailable

## Time Slots
- 10:00 AM - 11:00 AM
- 11:00 AM - 12:00 PM
- 12:00 PM - 1:00 PM
- 1:00 PM - 2:00 PM
- 2:00 PM - 3:00 PM
- 3:00 PM - 4:00 PM

## Data Storage
All data is stored in browser's localStorage, including:
- Doctors
- Patients
- Appointments
- User sessions
