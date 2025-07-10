# Student Collaboration Hub

A comprehensive web application for students to collaborate, share resources, and manage study groups.

## Project Structure

```
student-collab-hub/
├── backend/                 # Node.js/Express API server
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── package.json        # Backend dependencies
│   ├── server.js           # Main server file
│   └── config.env          # Environment variables
├── public/                 # Static files
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── App.js             # Main App component
│   └── index.js           # Entry point
├── package.json            # Frontend dependencies
└── README.md              # This file
```

## Features

### Frontend (React)
- **Beautiful Authentication System** - Modern login/signup page with animated particles background
- Modern, responsive UI with Tailwind CSS
- Real-time notifications
- Interactive dashboard
- User profile management
- Group management interface
- Resource sharing
- Meeting scheduler
- Admin panel

### Backend (Node.js/Express)
- RESTful API with Express
- JWT authentication
- MongoDB database with Mongoose
- Socket.IO for real-time features
- File upload handling
- Role-based access control
- Rate limiting and security

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### 1. Clone and Navigate
```bash
cd "E:\temp hub\hub\student-collab-hub"
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Environment Setup

Create a `.env` file in the backend directory:
```bash
cd backend
copy config.env .env
```

Edit the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/student-collab-hub

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 5. Database Setup
Start MongoDB:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

## Running the Application

### Development Mode

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on: http://localhost:5000

2. **Start Frontend Server** (in a new terminal)
   ```bash
   npm start
   ```
   Frontend will run on: http://localhost:3000

### Production Mode

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

## Authentication System

The application features a beautiful, modern authentication system:

### Login Page Features
- **Animated Background** - Particles.js animation with floating elements
- **Smooth Transitions** - Sliding animation between login and signup forms
- **Form Validation** - Real-time validation with error handling
- **Responsive Design** - Works perfectly on all device sizes
- **JWT Token Management** - Secure token-based authentication

### User Registration
- Full name, email, and password
- Department selection (Computer Science, Engineering, Business, Arts, Science, Medicine)
- Year selection (1st Year through 4th Year)
- Password confirmation
- Automatic login after successful registration

### User Login
- Email and password authentication
- Remember me functionality (token stored in localStorage)
- Automatic token verification on app load
- Secure logout with token cleanup

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users

### Groups
- `POST /api/groups` - Create new group
- `GET /api/groups` - Get all groups
- `GET /api/groups/my-groups` - Get user's groups
- `POST /api/groups/:id/join` - Join group
- `POST /api/groups/:id/leave` - Leave group

### Resources
- `POST /api/resources` - Upload resource
- `GET /api/resources` - Get all resources

### Announcements
- `POST /api/announcements` - Create announcement
- `GET /api/announcements` - Get all announcements

### Schedule
- `POST /api/schedule` - Create meeting
- `GET /api/schedule` - Get all meetings

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Platform analytics

## Database Models

### User Model
- Basic info: name, email, password, role
- Academic info: department, year, skills
- Preferences: notifications, theme
- Groups: joined groups
- Notifications: user notifications

### Group Model
- Basic info: name, description, subject
- Members: user list with roles
- Settings: privacy, permissions
- Chat: group messages
- Resources: shared files

## Socket.IO Events

### Client to Server
- `join-groups` - Join group rooms
- `send-message` - Send chat message
- `send-notification` - Send notification

### Server to Client
- `new-message` - New chat message
- `new-notification` - New notification

## Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Input Validation
- Rate Limiting
- CORS Protection
- Role-based Access Control

## Development

### Code Structure
- **Frontend**: React components with modern hooks
- **Backend**: Express routes with middleware
- **Database**: MongoDB with Mongoose schemas
- **Real-time**: Socket.IO for live features

### Testing
```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
```

## Deployment

### Frontend (React)
- Build with `npm run build`
- Deploy to any static hosting (Netlify, Vercel, etc.)

### Backend (Node.js)
- Set production environment variables
- Deploy to cloud platforms (Heroku, AWS, etc.)
- Configure MongoDB connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Quick Start Commands

```bash
# Install everything
npm install && cd backend && npm install && cd ..

# Start development servers
cd backend && npm run dev & cd .. && npm start

# Build for production
npm run build && cd backend && npm start
``` 