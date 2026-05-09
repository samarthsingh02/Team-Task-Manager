# Team Task Manager

A full-stack web application where users can create projects, assign tasks, and track progress with role-based access control (Admin/Member).

## 🚀 Features
- **Authentication (Signup/Login)**: Secure user authentication using JWT and bcrypt.
- **Project & Team Management**: Admins can create projects and view overall progress.
- **Task Management**: Create tasks, assign them to team members, and update task statuses (Todo, In Progress, Completed).
- **Dashboard**: Real-time overview of tasks including Total, Completed, Pending, and Overdue tasks.
- **Role-Based Access Control (RBAC)**: 
  - **Admins**: Can create projects, add members, and create tasks.
  - **Members**: Can view projects they are assigned to and update the status of their assigned tasks.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router DOM, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "Team Task Manager"
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory and add your MongoDB Atlas Connection String:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=supersecretkey
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *(Ensure you have `"dev": "nodemon server.js"` in your Backend package.json, or start it using `node server.js`)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory (if deploying separately, or to point to your live backend URL):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🌐 Live URL
[Insert your Railway Live URL here]

## 🎥 Demo Video
[Insert your 2-5 min Demo Video Link here]
