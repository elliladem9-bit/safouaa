# Safoua Academy - Frontend

A modern, responsive React frontend for Safoua Academy featuring Quran recitation, Arabic language, and Islamic sciences education.

## 🚀 Features Implemented

### ✅ Core Features
- **Authentication System**
  - Login/Register with form validation
  - Password reset flow
  - JWT token management with auto-refresh
  - Protected routes based on user roles
  - Persistent authentication state

- **Responsive Layout**
  - Modern Navbar with user menu
  - Footer with links
  - Mobile-friendly navigation
  - Islamic-themed design with green color scheme

- **State Management**
  - React Context API for authentication
  - Centralized API service with Axios
  - Request/response interceptors
  - Error handling with toast notifications

## 📦 Tech Stack

- **React 18** - UI library
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Yup** - Form validation
- **React Toastify** - Notifications
- **React Icons** - Icon library
- **Vite** - Build tool

## 🛠️ Installation

1. **Navigate to frontend folder:**
```bash
cd safoua-front
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The app will run on `http://localhost:3000` and proxy API requests to `http://localhost:5000`

4. **Build for production:**
```bash
npm run build
```

## 📁 Project Structure

```
safoua-front/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── ProtectedRoute.jsx
│   │   └── Layout/
│   │       ├── Layout.jsx
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   └── Auth/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── ForgotPassword.jsx
│   │       └── ResetPassword.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Design System

### Colors
- **Primary Green**: `#16a34a` (Islamic theme)
- **Gold Accents**: `#f59e0b`
- **Gray Scale**: For text and backgrounds

### Fonts
- **Inter**: Main UI font
- **Amiri**: Arabic text font

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token included in all API requests
4. Auto-refresh on token expiration
5. Auto-logout on refresh failure

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Hamburger menu for mobile
- Touch-friendly interface

## 🚧 Pages to Implement

Create these additional pages based on your needs:

### Home Page (`src/pages/Home.jsx`)
```jsx
- Hero section
- Featured courses
- Categories
- Testimonials
- Statistics
- CTA buttons
```

### Dashboard (`src/pages/Dashboard/Dashboard.jsx`)
```jsx
- Student: Enrolled courses, progress, assignments
- Teacher: My courses, students, analytics
- Admin: User management, statistics
```

### Courses (`src/pages/Courses/`)
```jsx
- Courses.jsx: Browse/filter courses
- CourseDetail.jsx: Course information
- CoursePlayer.jsx: Learning interface
```

## 🔧 API Integration

All API calls go through `src/services/api.js`:

```javascript
import api from '../services/api';

// GET request
const response = await api.get('/courses');

// POST request
const response = await api.post('/courses', data);

// With auth token (automatic)
// Token is automatically added from localStorage
```

## 🚀 To Get Started:

1. Make sure your backend is running on port 5000
2. Navigate to `safoua-front` folder
3. Run `npm install`
4. Run `npm run dev`
5. Open `http://localhost:3000`

The authentication system is fully functional and ready to connect to your backend!