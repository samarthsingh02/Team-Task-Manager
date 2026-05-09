# Team Task Manager

A full-stack web application designed for teams to create projects, assign tasks, and track progress efficiently. The application features role-based access control with distinct permissions for Admins and Members.

## Features

- User Authentication: Secure signup and login functionality using JWT.
- Role-Based Access Control: Admin and Member roles with different permissions.
- Project Management: Admins can create projects, update details, delete projects, and add team members.
- Task Tracking: Create, assign, edit, and delete tasks within projects.
- Status Management: Track task progress (Todo, In Progress, Completed).
- Dashboard: Real-time statistics showing total, completed, pending, and overdue tasks.

## Technology Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JSON Web Tokens (JWT), bcryptjs

## Local Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas connection string

### Backend Setup
1. Open a terminal and navigate to the Backend directory:
   cd Backend
2. Install dependencies:
   npm install
3. Create a .env file in the Backend directory and add the following variables:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
4. Start the backend server:
   npm run dev

### Frontend Setup
1. Open a new terminal and navigate to the Frontend directory:
   cd Frontend
2. Install dependencies:
   npm install
3. Create a .env file in the Frontend directory and add the following variable:
   VITE_API_URL=http://localhost:5000/api
4. Start the frontend development server:
   npm run dev

## Deployment Setup (Railway)

1. Push this repository to GitHub.
2. Deploy the Backend:
   - Create a new project in Railway from the GitHub repository.
   - Set the Root Directory to /Backend.
   - Add MONGO_URI and JWT_SECRET as environment variables.
   - Generate a public domain for the Backend service.
3. Deploy the Frontend:
   - Create a second service in Railway from the same GitHub repository.
   - Set the Root Directory to /Frontend (or /frontend depending on your folder casing).
   - Add VITE_API_URL as an environment variable, pointing to your live Backend URL (e.g., https://your-backend-url.up.railway.app/api).
   - Generate a public domain for the Frontend service.

## Live URL
https://team-task-manager-production-1881.up.railway.app/login
