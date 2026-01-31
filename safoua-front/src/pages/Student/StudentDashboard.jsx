import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaChartLine, 
  FaClock, 
  FaPlay,
  FaUserTie,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [teacherApplication, setTeacherApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [showTeacherApplicationModal, setShowTeacherApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    message: '',
    qualifications: '',
    teachingExperience: ''
  });
  const [submittingApplication, setSubmittingApplication] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      await Promise.all([
        fetchEnrolledCourses(),
        fetchEnrollmentRequests(),
        checkTeacherApplicationStatus()
      ]);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll use a placeholder
      setEnrolledCourses([]);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const fetchEnrollmentRequests = async () => {
    try {
      const response = await api.get('/enrollment-requests/student');
      setEnrollmentRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching enrollment requests:', error);
    }
  };

  const checkTeacherApplicationStatus = async () => {
    try {
      if (user?.teacherApplicationStatus && user.teacherApplicationStatus !== 'none') {
        setTeacherApplication({
          status: user.teacherApplicationStatus,
          message: user.teacherApplicationMessage || '',
          qualifications: user.qualifications || '',
          teachingExperience: user.teachingExperience || ''
        });
      }
    } catch (error) {
      console.error('Error checking teacher application status:', error);
    }
  };

  const handleTeacherApplication = async () => {
    setSubmittingApplication(true);
    try {
      await api.post('/admin/apply-teacher', applicationData);
      toast.success('Teacher application submitted successfully!');
      setShowTeacherApplicationModal(false);
      setTeacherApplication({
        status: 'pending',
        ...applicationData
      });
      setApplicationData({ message: '', qualifications: '', teachingExperience: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmittingApplication(false);
    }
  };

  const cancelEnrollmentRequest = async (requestId) => {
    try {
      await api.delete(`/enrollment-requests/${requestId}`);
      toast.success('Enrollment request cancelled');
      fetchEnrollmentRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel request');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaHourglassHalf className="text-yellow-500" />;
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Teacher Application Status */}
        {teacherApplication && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <FaUserTie className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Teacher Application</h3>
                  <p className="text-gray-600">Your application to become a teacher</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(teacherApplication.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(teacherApplication.status)}`}>
                  {teacherApplication.status.charAt(0).toUpperCase() + teacherApplication.status.slice(1)}
                </span>
              </div>
            </div>
            {teacherApplication.status === 'pending' && (
              <p className="text-gray-600 mt-3">
                Your application is being reviewed by our admin team. You'll be notified once a decision is made.
              </p>
            )}
            {teacherApplication.status === 'approved' && (
              <p className="text-green-600 mt-3">
                Congratulations! Your teacher application has been approved. You now have teacher privileges.
              </p>
            )}
            {teacherApplication.status === 'rejected' && (
              <p className="text-red-600 mt-3">
                Your teacher application was not approved at this time. You can reapply in the future.
              </p>
            )}
          </div>
        )}

        {/* Apply to be Teacher Card */}
        {!teacherApplication && (
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Become a Teacher</h3>
                <p className="text-purple-100">
                  Share your knowledge and create courses for other students to learn from.
                </p>
              </div>
              <button
                onClick={() => setShowTeacherApplicationModal(true)}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                Apply Now
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaBook className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900">0%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hours Learned</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
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
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'courses' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">My Courses</h3>
                  <Link
                    to="/courses"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    Browse Courses
                  </Link>
                </div>
                
                {enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => (
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
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500">Progress: {course.progress || 0}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full" 
                                style={{ width: `${course.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                          <Link
                            to={`/courses/${course._id}/player`}
                            className="w-full bg-primary-600 text-white py-2 rounded text-center hover:bg-primary-700 transition flex items-center justify-center"
                          >
                            <FaPlay className="mr-2" />
                            Continue Learning
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaBook className="text-gray-300 text-4xl mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-500 mb-4">Start your learning journey by enrolling in a course.</p>
                    <Link
                      to="/courses"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      Browse Courses
                    </Link>
                  </div>
                )}
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
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              {request.course.thumbnail ? (
                                <img src={request.course.thumbnail} alt={request.course.title} className="w-12 h-12 rounded-lg object-cover" />
                              ) : (
                                <FaBook className="text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{request.course.title}</h4>
                              <p className="text-sm text-gray-500">
                                Instructor: {request.course.instructor?.name || 'Unknown'}
                              </p>
                            </div>
                          </div>
                          
                          {request.message && (
                            <p className="text-gray-600 text-sm mb-2">
                              <span className="font-medium">Your message:</span> {request.message}
                            </p>
                          )}
                          
                          {request.teacherResponse && (
                            <p className="text-gray-600 text-sm mb-2">
                              <span className="font-medium">Teacher response:</span> {request.teacherResponse}
                            </p>
                          )}
                          
                          <p className="text-xs text-gray-500">
                            Requested {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3 ml-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(request.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                          
                          {request.status === 'pending' && (
                            <button
                              onClick={() => cancelEnrollmentRequest(request._id)}
                              className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {enrollmentRequests.length === 0 && (
                    <div className="text-center py-12">
                      <FaClock className="text-gray-300 text-4xl mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollment requests</h3>
                      <p className="text-gray-500">Your course enrollment requests will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Application Modal */}
        {showTeacherApplicationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Apply to Become a Teacher
              </h3>
              <p className="text-gray-600 mb-6">
                Tell us about yourself and why you'd like to become a teacher on our platform.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Message
                  </label>
                  <textarea
                    value={applicationData.message}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us why you want to become a teacher..."
                    className="w-full border border-gray-300 rounded-lg p-3 resize-none"
                    rows="4"
                    maxLength="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications
                  </label>
                  <textarea
                    value={applicationData.qualifications}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, qualifications: e.target.value }))}
                    placeholder="List your relevant qualifications, certifications, degrees..."
                    className="w-full border border-gray-300 rounded-lg p-3 resize-none"
                    rows="3"
                    maxLength="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teaching Experience
                  </label>
                  <textarea
                    value={applicationData.teachingExperience}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, teachingExperience: e.target.value }))}
                    placeholder="Describe your teaching experience, if any..."
                    className="w-full border border-gray-300 rounded-lg p-3 resize-none"
                    rows="3"
                    maxLength="1000"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowTeacherApplicationModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  disabled={submittingApplication}
                >
                  Cancel
                </button>
                <button
                  onClick={handleTeacherApplication}
                  disabled={submittingApplication}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center"
                >
                  {submittingApplication ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;