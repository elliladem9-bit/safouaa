# Safoua Academy - Islamic E-Learning Platform

A comprehensive full-stack e-learning platform for Islamic education, featuring Quran study, course management, and interactive learning tools.

## 🌟 Features

### For Students
- 📚 Browse and enroll in Islamic courses
- 📖 Complete Quran reader with audio recitation (Sheikh Alafasy)
- 🎯 Track learning progress
- 💬 Messaging system with teachers
- 📊 View course analytics and achievements
- 👤 Personal profile management

### For Teachers
- 📝 Create and manage courses
- 🎥 Upload lessons with video, audio, and documents
- 👥 Monitor student progress
- 📈 View course analytics
- ✅ Grade assessments
- 💬 Communicate with students

### For Admins
- 👑 Full platform management
- 👨‍🏫 Approve teacher applications
- 📊 View platform analytics
- 👥 Manage users and courses
- 🔧 System configuration

### Quran Features
- 📖 All 114 Surahs with authentic Uthmani script
- 🔊 Audio recitation by Sheikh Alafasy
- 🌍 English translations (Sahih International)
- 🔍 Search functionality
- 📱 Responsive design

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios
- React Hook Form
- React Toastify
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io (real-time features)
- Multer (file uploads)
- Local file storage

### APIs
- Al-Quran Cloud API (Quran data)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/safoua-academy.git
cd safoua-academy
```

### 2. Backend Setup
```bash
cd safoua-back
npm install
```

Create a `.env` file in `safoua-back` directory:
```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/safoua-academy
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@safouaacademy.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STORAGE_TYPE=local
FRONTEND_URL=http://localhost:3001
```

### 3. Frontend Setup
```bash
cd ../safoua-front
npm install
```

### 4. Initialize Database
```bash
cd ../safoua-back
node scripts/initialize.js
```

This will create test accounts:
- **Admin**: admin@safouaacademy.com / Admin123!
- **Teacher**: teacher@safouaacademy.com / Teacher123!
- **Student**: student@safouaacademy.com / Student123!

## 🎯 Running the Application

### Option 1: Run Both Servers Together (Recommended)
```bash
# From the root directory
bash start.sh
```

### Option 2: Run Servers Separately

**Backend:**
```bash
cd safoua-back
npm run dev
```

**Frontend:**
```bash
cd safoua-front
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend: http://localhost:5001
- API: http://localhost:5001/api

## 📁 Project Structure

```
safoua-academy/
├── safoua-back/          # Backend (Node.js/Express)
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── scripts/          # Utility scripts
│   ├── uploads/          # Uploaded files
│   └── utils/            # Helper functions
├── safoua-front/         # Frontend (React)
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # Reusable components
│       ├── context/      # React context
│       ├── pages/        # Page components
│       └── services/     # API services
└── start.sh              # Startup script
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-profile-picture` - Upload profile picture

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (Teacher/Admin)
- `PUT /api/courses/:id` - Update course (Teacher/Admin)
- `DELETE /api/courses/:id` - Delete course (Teacher/Admin)
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/my-courses` - Get teacher's courses
- `GET /api/courses/enrollments/my-enrollments` - Get student enrollments

### Quran
- `GET /api/quran/surahs` - Get all Surahs
- `GET /api/quran/surah/:number` - Get Surah with verses and audio

### Messages
- `GET /api/messages/inbox` - Get inbox messages
- `GET /api/messages/sent` - Get sent messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read
- `DELETE /api/messages/:id` - Delete message

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get platform analytics
- `PUT /api/admin/users/:id/promote-teacher` - Promote user to teacher
- `GET /api/admin/teacher-applications` - Get teacher applications

## 🎨 Features in Detail

### Quran Reader
- Complete Quran with all 114 Surahs
- Authentic Uthmani script from Al-Quran Cloud API
- Audio recitation by Sheikh Alafasy
- English translations
- Verse-by-verse playback
- Search and navigation
- Responsive design

### Course Management
- Rich course creation with multimedia support
- Lesson organization
- Student enrollment system
- Progress tracking
- Assessments and grading

### User Roles
- **Student**: Enroll in courses, track progress, message teachers
- **Teacher**: Create courses, manage students, grade assessments
- **Admin**: Full platform control, user management, analytics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting
- Input validation
- XSS protection
- CORS configuration

## 📝 Scripts

```bash
# Backend
npm run dev          # Start development server
npm start            # Start production server
node scripts/initialize.js  # Initialize database with test data
node scripts/createAdmin.js # Create admin account
node scripts/populateQuran.js # Populate Quran data

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Adem Ellil** - Initial work

## 🙏 Acknowledgments

- Al-Quran Cloud API for Quran data
- Sheikh Alafasy for audio recitations
- All contributors and testers

## 📞 Support

For support, email admin@safouaacademy.com or open an issue on GitHub.

## 🔄 Version History

- **v1.0.0** (2026-02-23)
  - Initial release
  - Complete Quran reader with audio
  - Course management system
  - User authentication and authorization
  - Messaging system
  - Profile management
  - Admin dashboard
