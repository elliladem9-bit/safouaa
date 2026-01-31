# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10,
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification.",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isVerified": true
  }
}
```

### Verify Email
```http
GET /api/auth/verify-email/:token
```

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Reset Password
```http
PUT /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "newpassword123"
}
```

### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### Enable 2FA
```http
POST /api/auth/2fa/enable
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "secret": "base32_secret"
}
```

### Verify 2FA
```http
POST /api/auth/2fa/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "123456"
}
```

## User Endpoints

### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "My bio"
}
```

### Upload Profile Picture
```http
POST /api/users/profile-picture
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

## Course Endpoints

### Get All Courses
```http
GET /api/courses?category=Quran&level=Beginner&page=1&limit=10
```

**Query Parameters:**
- `category` - Filter by category (Quran, Arabic, Islamic Sciences, etc.)
- `level` - Filter by level (Beginner, Intermediate, Advanced)
- `search` - Search in title and description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Get Single Course
```http
GET /api/courses/:id
```

### Create Course
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tajweed Basics",
  "description": "Learn the fundamentals of Tajweed",
  "category": "Quran",
  "level": "Beginner",
  "price": 0,
  "isFree": true,
  "requirements": ["Basic Arabic knowledge"],
  "learningOutcomes": ["Understand Tajweed rules", "Apply rules in recitation"]
}
```

### Update Course
```http
PUT /api/courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "isPublished": true
}
```

### Enroll in Course
```http
POST /api/courses/:id/enroll
Authorization: Bearer <token>
```

### Upload Course Thumbnail
```http
POST /api/courses/:id/thumbnail
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

## Lesson Endpoints

### Get Lessons by Course
```http
GET /api/lessons/course/:courseId
```

### Create Lesson
```http
POST /api/lessons
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction to Tajweed",
  "course": "course_id",
  "content": "Lesson content here...",
  "order": 1,
  "duration": 600,
  "isFree": false,
  "isPublished": true
}
```

### Upload Lesson Video
```http
POST /api/lessons/:id/video
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: <file>
```

### Upload Lesson Audio
```http
POST /api/lessons/:id/audio
Authorization: Bearer <token>
Content-Type: multipart/form-data

audio: <file>
```

### Upload Lesson Document
```http
POST /api/lessons/:id/document
Authorization: Bearer <token>
Content-Type: multipart/form-data

document: <file>
title: "Document Title"
```

## Quran Endpoints

### Get All Surahs
```http
GET /api/quran/surahs
```

### Get Single Surah
```http
GET /api/quran/surahs/:id
```

### Submit Recitation
```http
POST /api/quran/recitation/submit
Authorization: Bearer <token>
Content-Type: multipart/form-data

audio: <file>
surah: "surah_id"
ayahFrom: 1
ayahTo: 5
teacher: "teacher_id"
```

### Get Recitation Submissions
```http
GET /api/quran/recitation/submissions
Authorization: Bearer <token>
```

### Review Recitation
```http
PUT /api/quran/recitation/:id/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "feedback": "Good recitation, work on makharij",
  "grade": "Good",
  "tajweedNotes": "Pay attention to noon sakinah rules"
}
```

### Get Tajweed Rules
```http
GET /api/quran/tajweed?category=Noon Sakinah
```

## Assessment Endpoints

### Get Assessments by Course
```http
GET /api/assessments/course/:courseId
Authorization: Bearer <token>
```

### Create Assessment
```http
POST /api/assessments
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tajweed Quiz 1",
  "course": "course_id",
  "type": "quiz",
  "description": "Test your knowledge",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What is Tajweed?",
      "options": ["Option 1", "Option 2", "Option 3"],
      "correctAnswer": "Option 1",
      "points": 1
    }
  ],
  "passingScore": 70,
  "timeLimit": 1800,
  "isPublished": true
}
```

### Submit Assessment
```http
POST /api/assessments/:id/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "question_id",
      "answer": "Option 1"
    }
  ]
}
```

### Grade Submission
```http
PUT /api/assessments/submission/:id/grade
Authorization: Bearer <token>
Content-Type: application/json

{
  "score": 85,
  "feedback": "Well done! Review question 3."
}
```

## Progress Endpoints

### Get Progress
```http
GET /api/progress/course/:courseId
Authorization: Bearer <token>
```

### Mark Lesson Complete
```http
POST /api/progress/lesson/:lessonId/complete
Authorization: Bearer <token>
```

## Message Endpoints

### Send Message
```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipient": "user_id",
  "subject": "Question about lesson",
  "content": "I have a question..."
}
```

### Get Conversations
```http
GET /api/messages/conversations
Authorization: Bearer <token>
```

### Get Messages with User
```http
GET /api/messages/:userId
Authorization: Bearer <token>
```

### Mark as Read
```http
PUT /api/messages/:messageId/read
Authorization: Bearer <token>
```

## Forum Endpoints

### Get Forum Posts
```http
GET /api/forum/course/:courseId?page=1&limit=10
Authorization: Bearer <token>
```

### Create Forum Post
```http
POST /api/forum
Authorization: Bearer <token>
Content-Type: application/json

{
  "course": "course_id",
  "title": "Question about Tajweed",
  "content": "Can someone explain..."
}
```

### Add Comment
```http
POST /api/forum/:id/comment
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Here's my answer..."
}
```

### Pin Post
```http
PUT /api/forum/:id/pin
Authorization: Bearer <token>
```

### Lock Post
```http
PUT /api/forum/:id/lock
Authorization: Bearer <token>
```

## Admin Endpoints

### Get All Users
```http
GET /api/admin/users?role=student&page=1&limit=20
Authorization: Bearer <token>
```

### Approve Teacher
```http
PUT /api/admin/teachers/:id/approve
Authorization: Bearer <token>
```

### Get Pending Teachers
```http
GET /api/admin/teachers/pending
Authorization: Bearer <token>
```

### Get Analytics
```http
GET /api/admin/analytics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1000,
      "totalStudents": 850,
      "totalTeachers": 50,
      "pendingTeachers": 5,
      "totalCourses": 100,
      "publishedCourses": 85,
      "totalEnrollments": 5000
    },
    "recentEnrollments": [...],
    "popularCourses": [...]
  }
}
```

## Rate Limits

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- Upload: 20 requests per hour

## File Upload Limits

- Images: 5 MB
- Videos: 500 MB
- Audio: 100 MB
- Documents: 10 MB

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Enhanced Features (New)

### Enrollment Request System
Students can request enrollment in courses, and teachers can approve/reject these requests.

#### Create Enrollment Request
```http
POST /api/enrollment-requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id_here",
  "message": "I'm very interested in this course and would like to enroll."
}
```

#### Get Student's Enrollment Requests
```http
GET /api/enrollment-requests/student?status=pending&page=1&limit=20
Authorization: Bearer <token>
```

#### Get Teacher's Enrollment Requests
```http
GET /api/enrollment-requests/teacher?status=pending&page=1&limit=20
Authorization: Bearer <token>
```

#### Respond to Enrollment Request (Teacher)
```http
PUT /api/enrollment-requests/:id/respond
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "teacherResponse": "Welcome to the course! Looking forward to having you."
}
```

#### Cancel Enrollment Request (Student)
```http
DELETE /api/enrollment-requests/:id
Authorization: Bearer <token>
```

### Teacher Application System
Students can apply to become teachers, and admins can review and approve applications.

#### Apply for Teacher Role (Student)
```http
POST /api/admin/apply-teacher
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I would like to become a teacher to share my knowledge of Islamic studies.",
  "qualifications": "Master's in Islamic Studies, 5 years teaching experience",
  "teachingExperience": "Taught at local Islamic center for 5 years"
}
```

#### Get Teacher Applications (Admin)
```http
GET /api/admin/teacher-applications?status=pending&page=1&limit=20
Authorization: Bearer <token>
```

#### Respond to Teacher Application (Admin)
```http
PUT /api/admin/teacher-applications/:id/respond
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "adminResponse": "Your qualifications are excellent. Welcome to our teaching team!"
}
```

### Enhanced Course Management

#### Get Teacher's Students
```http
GET /api/courses/teacher/students?courseId=course_id&page=1&limit=20
Authorization: Bearer <token>
```

#### Get Course Analytics (Teacher)
```http
GET /api/courses/:id/analytics
Authorization: Bearer <token>
```

### Enhanced Admin Features

#### Promote User to Teacher
```http
PUT /api/admin/users/:id/promote-teacher
Authorization: Bearer <token>
```

## User Roles and Permissions

### Student
- View courses and course details
- Request enrollment in courses
- Track learning progress
- Apply for teacher role
- Manage enrollment requests

### Teacher (Requires Admin Approval)
- All student permissions
- Create and manage courses
- View enrolled students
- Approve/reject enrollment requests
- Access course analytics
- Upload course content (PDF, audio)

### Admin
- All teacher permissions
- Manage all users
- Approve teacher applications
- Promote users to teacher role
- Access platform analytics
- Delete users and courses

## Workflow Examples

### Student Enrollment Workflow
1. Student browses courses (public)
2. Student requests enrollment via `POST /api/enrollment-requests`
3. Teacher receives notification and reviews request
4. Teacher approves/rejects via `PUT /api/enrollment-requests/:id/respond`
5. Student receives notification and can access course if approved

### Teacher Application Workflow
1. Student applies for teacher role via `POST /api/admin/apply-teacher`
2. Admin receives notification and reviews application
3. Admin approves/rejects via `PUT /api/admin/teacher-applications/:id/respond`
4. If approved, user gains teacher privileges and can create courses

### Course Creation Workflow
1. Teacher creates course via `POST /api/courses`
2. Teacher adds lessons and content
3. Teacher publishes course
4. Students can discover and request enrollment
5. Teacher manages enrollment requests and student progress

## Email Notifications

The system automatically sends email notifications for:
- Enrollment request submissions
- Enrollment approvals/rejections
- Teacher application submissions
- Teacher application approvals/rejections
- Teacher role promotions

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Pagination

List endpoints support pagination with query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

Response includes pagination metadata:
```json
{
  "success": true,
  "count": 50,
  "totalPages": 3,
  "currentPage": 1,
  "data": [...]
}
```

## Error Handling

All endpoints return consistent error responses with appropriate HTTP status codes. Validation errors include field-specific error messages.