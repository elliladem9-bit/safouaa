import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import StudentDashboard from './pages/Student/StudentDashboard';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import Courses from './pages/Courses/Courses';
import CourseDetail from './pages/Courses/CourseDetail';
import CoursePlayer from './pages/Courses/CoursePlayer';
import QuranSection from './pages/Quran/QuranSection';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import Messages from './pages/Messages/Messages';
import CreateCourse from './pages/Teacher/CreateCourse';
import MyCourses from './pages/Teacher/MyCourses';
import CreateLesson from './pages/Teacher/CreateLesson';
import ManageCourse from './pages/Teacher/ManageCourse';
import AdminPanel from './pages/Admin/AdminPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          
          {/* Protected Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="student-dashboard" element={
            <ProtectedRoute roles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="teacher-dashboard" element={
            <ProtectedRoute roles={['teacher', 'admin']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          
          <Route path="courses/:courseId/play" element={
            <ProtectedRoute>
              <CoursePlayer />
            </ProtectedRoute>
          } />
          
          <Route path="courses/:courseId/play/:lessonId" element={
            <ProtectedRoute>
              <CoursePlayer />
            </ProtectedRoute>
          } />
          
          <Route path="quran" element={
            <ProtectedRoute>
              <QuranSection />
            </ProtectedRoute>
          } />
          
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="profile/edit" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />
          
          <Route path="messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
          
          {/* Teacher Routes */}
          <Route path="create-course" element={
            <ProtectedRoute roles={['teacher', 'admin']}>
              <CreateCourse />
            </ProtectedRoute>
          } />
          
          <Route path="my-courses" element={
            <ProtectedRoute roles={['teacher', 'admin']}>
              <MyCourses />
            </ProtectedRoute>
          } />
          
          <Route path="courses/:courseId/manage" element={
            <ProtectedRoute roles={['teacher', 'admin']}>
              <ManageCourse />
            </ProtectedRoute>
          } />
          
          <Route path="courses/:courseId/create-lesson" element={
            <ProtectedRoute roles={['teacher', 'admin']}>
              <CreateLesson />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="admin/*" element={
            <ProtectedRoute roles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;