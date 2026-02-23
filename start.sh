#!/bin/bash

# Safoua Academy Project Startup Script
# This script starts both the backend and frontend servers

echo "🚀 Starting Safoua Academy Project..."

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
  echo "❌ Node.js is not installed. Please install Node.js (v16+) first."
  exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
  echo "❌ npm is not installed. Please install npm first."
  exit 1
fi

# Check if MongoDB is running (optional, but recommended)
if ! pgrep -x "mongod" > /dev/null; then
  echo "⚠️  MongoDB is not running. Please start MongoDB first:"
  echo "   macOS: brew services start mongodb/brew/mongodb-community"
  echo "   Or manually: mongod"
  echo ""
  echo "Continuing anyway..."
fi

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Backend setup and start
echo "🔧 Setting up backend..."
cd "$SCRIPT_DIR/safoua-back"

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  npm install
  if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
  fi
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
  echo "📝 Creating .env file..."
  cat > .env << EOF
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/safoua-academy
JWT_SECRET=safoua_academy_jwt_secret_key_2024_development_super_secure
JWT_REFRESH_SECRET=safoua_academy_refresh_secret_key_2024_development_super_secure
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@safouaacademy.com
EMAIL_PASSWORD=dummy_password
EMAIL_FROM=noreply@safouaacademy.com
CLOUDINARY_CLOUD_NAME=safoua-academy
CLOUDINARY_API_KEY=dummy_key
CLOUDINARY_API_SECRET=dummy_secret
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=52428800
MAX_VIDEO_SIZE=524288000
MAX_AUDIO_SIZE=104857600
EOF
fi

# Initialize database if needed
echo "🗄️  Initializing database..."
node scripts/initialize.js

# Start backend server
echo "🚀 Starting backend server..."
PORT=5001 node server.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Frontend setup and start
echo "🔧 Setting up frontend..."
cd "$SCRIPT_DIR/safoua-front"

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
  if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
  fi
fi

# Start frontend server
echo "🚀 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Project started successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5001"
echo "📊 Health:   http://localhost:5001/health"
echo ""
echo "Test Accounts:"
echo "👑 Admin:   admin@safouaacademy.com / Admin123!"
echo "👨‍🏫 Teacher: teacher@safouaacademy.com / Teacher123!"
echo "👨‍🎓 Student: student@safouaacademy.com / Student123!"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Stopping servers..."
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  echo "✅ Servers stopped"
  exit 0
}

# Trap SIGINT (Ctrl+C) to cleanup
trap cleanup SIGINT

# Wait for background processes
wait