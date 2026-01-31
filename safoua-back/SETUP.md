# Safoua Academy - Islamic E-Learning Platform

## 🚀 Quick Start

### Backend Setup
```bash
cd safoua-back
npm install
npm run setup
```

This will:
- Create the .env file
- Initialize the database
- Create test accounts
- Start the server

### Frontend Setup
```bash
cd safoua-front
npm install
npm run dev
```

## 🔑 Test Accounts

After running `npm run setup`, you can login with:

- **Admin**: `admin@safouaacademy.com` / `Admin123!`
- **Teacher**: `teacher@safouaacademy.com` / `Teacher123!`
- **Student**: `student@safouaacademy.com` / `Student123!`

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🛠️ Manual Setup (if needed)

If the quick start doesn't work:

1. **Start MongoDB**:
   ```bash
   # macOS with Homebrew
   brew services start mongodb/brew/mongodb-community
   
   # Or manually
   mongod
   ```

2. **Initialize Database**:
   ```bash
   cd safoua-back
   npm run init
   ```

3. **Start Backend**:
   ```bash
   npm run dev
   ```

4. **Start Frontend**:
   ```bash
   cd ../safoua-front
   npm run dev
   ```

## 🔧 Troubleshooting

If you encounter issues:

```bash
cd safoua-back
npm run diagnose
```

This will check your setup and provide specific fixes.

## ✨ Features

- **Role-based Authentication** (Student, Teacher, Admin)
- **Course Management** with enrollment requests
- **Teacher Application System**
- **Progress Tracking**
- **Real-time Messaging**
- **File Upload Support**
- **Responsive Design**

## 🏗️ Architecture

- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Frontend**: React, Vite, Tailwind CSS
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary integration
- **Email**: Nodemailer support