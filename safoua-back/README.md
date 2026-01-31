# Safoua Academy - Backend

A secure, scalable REST API backend for Safoua Academy built with Node.js, Express, and MongoDB. The platform facilitates learning for Quranic recitation, Arabic language, and Islamic sciences with distinct roles for students, teachers, and administrators.

## Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Teacher, Student)
- Secure password hashing using bcrypt
- Email verification for new accounts
- Password reset functionality with time-limited tokens
- Two-factor authentication (2FA) support

### User Management
- User profiles with customizable information
- Teacher verification system (admin approval)
- Student progress tracking
- Profile picture upload
- Admin dashboard for user management

### Course Management
- Complete CRUD operations for courses
- Multiple categories (Quran, Arabic, Islamic Sciences, Hadith, Fiqh, Tafsir)
- Lesson management with multimedia support
- Course enrollment system
- Progress tracking per student
- Course search and filtering

### Quran Recitation Features
- Audio file storage and streaming
- Surah/Ayah organization
- Tajweed rules reference
- Student recitation submission
- Teacher feedback system

### Assessment System
- Multiple question types (multiple choice, true/false, fill-in-the-blank)
- Assignment submission
- Auto-grading for quizzes
- Manual grading by teachers
- Certificate generation upon completion

### Communication
- Discussion forum per course
- Private messaging between users
- Announcement system
- Comment system on forum posts
- Real-time notifications via Socket.io

### Security Features
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Helmet.js for HTTP headers security
- MongoDB injection prevention
- File upload validation
- Secure file storage with Cloudinary

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Validation**: express-validator
- **Security**: Helmet.js, express-rate-limit
- **Email**: Nodemailer
- **Logging**: Winston, Morgan
- **Real-time**: Socket.io
- **2FA**: Speakeasy, QRCode

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Cloudinary account (for file storage)
- SMTP server (for emails)

### Setup Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd islamic-elearning-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/islamic-elearning

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@islamicelearning.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits (in bytes)
MAX_FILE_SIZE=52428800
MAX_VIDEO_SIZE=524288000
MAX_AUDIO_SIZE=104857600
```

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /verify-email/:token` - Verify email
- `POST /forgot-password` - Request password reset
- `PUT /reset-password/:token` - Reset password
- `POST /refresh-token` - Refresh access token
- `POST /logout` - Logout user
- `POST /2fa/enable` - Enable 2FA
- `POST /2fa/verify` - Verify and activate 2FA
- `POST /2fa/disable` - Disable 2FA

### Users (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /account` - Delete user account
- `POST /profile-picture` - Upload profile picture

### Courses (`/api/courses`)
- `GET /` - Get all courses (with filters)
- `GET /:id` - Get single course
- `POST /` - Create course (Teacher/Admin)
- `PUT /:id` - Update course (Teacher/Admin)
- `DELETE /:id` - Delete course (Teacher/Admin)
- `POST /:id/enroll` - Enroll in course
- `POST /:id/unenroll` - Unenroll from course
- `POST /:id/thumbnail` - Upload course thumbnail

### Lessons (`/api/lessons`)
- `GET /course/:courseId` - Get lessons by course
- `GET /:id` - Get single lesson
- `POST /` - Create lesson (Teacher/Admin)
- `PUT /:id` - Update lesson (Teacher/Admin)
- `DELETE /:id` - Delete lesson (Teacher/Admin)
- `POST /:id/video` - Upload lesson video
- `POST /:id/audio` - Upload lesson audio
- `POST /:id/document` - Upload lesson document

### Quran (`/api/quran`)
- `GET /surahs` - Get all surahs
- `GET /surahs/:id` - Get single surah with ayahs
- `POST /recitation/submit` - Submit recitation
- `GET /recitation/submissions` - Get recitation submissions
- `PUT /recitation/:id/review` - Review recitation (Teacher/Admin)
- `GET /tajweed` - Get tajweed rules

### Assessments (`/api/assessments`)
- `GET /course/:courseId` - Get assessments by course
- `GET /:id` - Get single assessment
- `POST /` - Create assessment (Teacher/Admin)
- `PUT /:id` - Update assessment (Teacher/Admin)
- `DELETE /:id` - Delete assessment (Teacher/Admin)
- `POST /:id/submit` - Submit assessment
- `PUT /submission/:id/grade` - Grade submission (Teacher/Admin)
- `GET /:id/submissions` - Get submissions (Teacher/Admin)

### Progress (`/api/progress`)
- `GET /course/:courseId` - Get student progress
- `PUT /course/:courseId` - Update progress
- `POST /lesson/:lessonId/complete` - Mark lesson as complete

### Messages (`/api/messages`)
- `POST /` - Send message
- `GET /conversations` - Get conversations
- `GET /:userId` - Get messages with specific user
- `PUT /:messageId/read` - Mark message as read

### Forum (`/api/forum`)
- `GET /course/:courseId` - Get forum posts for course
- `GET /:id` - Get single forum post
- `POST /` - Create forum post
- `PUT /:id` - Update forum post
- `DELETE /:id` - Delete forum post
- `POST /:id/comment` - Add comment to post
- `PUT /:id/pin` - Pin/Unpin post (Teacher/Admin)
- `PUT /:id/lock` - Lock/Unlock post (Teacher/Admin)

### Admin (`/api/admin`)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PUT /teachers/:id/approve` - Approve teacher
- `GET /teachers/pending` - Get pending teachers
- `GET /analytics` - Get platform analytics

## Database Schema

### Collections
- **Users** - User accounts and profiles
- **Courses** - Course information
- **Lessons** - Lesson content and materials
- **Enrollments** - Student course enrollments
- **Assessments** - Quizzes and assignments
- **Submissions** - Assessment submissions
- **Surahs** - Quran surahs and ayahs
- **RecitationSubmissions** - Student recitation submissions
- **TajweedRules** - Tajweed rules reference
- **Messages** - Private messages
- **ForumPosts** - Discussion forum posts
- **Notifications** - User notifications

## Security Best Practices

1. **Authentication**: JWT tokens with short expiration times
2. **Password Security**: Bcrypt hashing with salt rounds
3. **Input Validation**: Express-validator for all inputs
4. **Rate Limiting**: Prevents brute force attacks
5. **CORS**: Configured for specific origins
6. **Helmet**: Security headers protection
7. **File Upload**: Type and size validation
8. **MongoDB**: Parameterized queries prevent injection
9. **Environment Variables**: Sensitive data in .env
10. **Error Handling**: No sensitive data in error messages

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Logging

- **Winston**: Structured logging to files
- **Morgan**: HTTP request logging
- **Log Files**: 
  - `logs/error.log` - Error logs
  - `logs/combined.log` - All logs

## Real-time Features

Socket.io is integrated for real-time features:
- New message notifications
- Live updates in forums
- Real-time notifications

## Testing

```bash
npm test
```

## Deployment

### Production Checklist
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure production MongoDB
4. Set up SSL/TLS
5. Configure production CORS
6. Set up monitoring and logging
7. Configure backup strategy
8. Set up CDN for static files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For support, email support@islamicelearning.com or create an issue in the repository.
