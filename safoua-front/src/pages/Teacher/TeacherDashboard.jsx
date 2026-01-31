import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaBook, 
  FaChartLine, 
  FaEnvelope, 
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaPlus,
  FaCog
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    pendingRequests: 0,
    totalRevenue: 0
  });
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      await Promise.all([
        fetchEnrollmentRequests(),
        fetchTeacherCourses(),
        fetchTeacherStats()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollmentRequests = async () => {
    try {
      const response = await api.get('/enrollment-requests/teacher?status=pending');
      setEnrollmentRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching enrollment requests:', error);
    }
  };

  const fetchTeacherCourses = async () => {
    try {
      const response = await api.get('/courses?instructor=' + user.id);
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchTeacherStats = async () => {
    try {
      const response = await api.get('/courses/teacher/students');
      const students = response.data.data || [];
      
      setStats(prev => ({
        ...prev,
        totalStudents: students.length,
        totalCourses: courses.length,
        pendingRequests: enrollmentRequests.length
      }));
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    }
  };

  const handleEnrollmentResponse = async (requestId, status, response = '') => {
    try {
      await api.put(`/enrollment-requests/${requestId}/respond`, {
        status,
        teacherResponse: response
      });
      
      toast.success(`Enrollment request ${status} successfully`);
      fetchEnrollmentRequests();
      fetchTeacherStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to respond to request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaBook className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaUsers className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaEnvelope className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaChartLine className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900">75%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Enrollment Requests ({enrollmentRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Courses
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {enrollmentRequests.slice(0, 5).map((request) => (
                      <div key={request._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <FaUsers className="text-primary-600 text-sm" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {request.student.name} requested enrollment
                            </p>
                            <p className="text-sm text-gray-500">
                              in {request.course.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEnrollmentResponse(request._id, 'approved')}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={() => handleEnrollmentResponse(request._id, 'rejected')}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          >
                            <FaTimesCircle />
                          </button>
                        </div>
                      </div>
                    ))}
                    {enrollmentRequests.length === 0 && (
                      <p className="text-gray-500 text-center py-8">No recent enrollment requests</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      to="/create-course"
                      className="p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition"
                    >
                      <FaPlus className="text-primary-600 text-xl mb-2" />
                      <h4 className="font-semibold text-gray-900">Create New Course</h4>
                      <p className="text-sm text-gray-600">Start building your next course</p>
                    </Link>
                    
                    <Link
                      to="/my-courses"
                      className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
                    >
                      <FaEye className="text-green-600 text-xl mb-2" />
                      <h4 className="font-semibold text-gray-900">View All Courses</h4>
                      <p className="text-sm text-gray-600">Manage your existing courses</p>
                    </Link>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <FaChartLine className="text-yellow-600 text-xl mb-2" />
                      <h4 className="font-semibold text-gray-900">Analytics</h4>
                      <p className="text-sm text-gray-600">View detailed course analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Requests</h3>
                <div className="space-y-4">
                  {enrollmentRequests.map((request) => (
                    <div key={request._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <FaUsers className="text-gray-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{request.student.name}</h4>
                              <p className="text-sm text-gray-500">{request.student.email}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">
                            <span className="font-medium">Course:</span> {request.course.title}
                          </p>
                          {request.message && (
                            <p className="text-gray-600 text-sm mb-3">
                              <span className="font-medium">Message:</span> {request.message}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Requested {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEnrollmentResponse(request._id, 'approved')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
                          >
                            <FaCheckCircle />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleEnrollmentResponse(request._id, 'rejected')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
                          >
                            <FaTimesCircle />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {enrollmentRequests.length === 0 && (
                    <div className="text-center py-12">
                      <FaEnvelope className="text-gray-300 text-4xl mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                      <p className="text-gray-500">You'll see enrollment requests from students here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">My Courses</h3>
                  <Link
                    to="/create-course"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    Create New Course
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course._id} className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <FaBook className="text-gray-400 text-2xl" />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>{course.students?.length || 0} students</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            course.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/courses/${course._id}/manage`}
                            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-center hover:bg-blue-200 transition flex items-center justify-center"
                          >
                            <FaCog className="mr-1" />
                            Manage
                          </Link>
                          <Link
                            to={`/courses/${course._id}/analytics`}
                            className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded text-center hover:bg-green-200 transition flex items-center justify-center"
                          >
                            <FaChartLine className="mr-1" />
                            Analytics
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <FaBook className="text-gray-300 text-4xl mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                      <p className="text-gray-500 mb-4">Create your first course to get started.</p>
                      <Link
                        to="/create-course"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                      >
                        Create Course
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;