import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaUsers, FaClock, FaPlay, FaLock, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  useEffect(() => {
    fetchCourse();
    fetchLessons();
    if (isAuthenticated) {
      checkEnrollmentStatus();
    }
  }, [id, isAuthenticated]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await api.get(`/lessons/course/${id}`);
      setLessons(response.data.data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      // Check if already enrolled
      const enrollmentResponse = await api.get('/progress/course/' + id);
      if (enrollmentResponse.data.success) {
        setEnrollmentStatus('enrolled');
        return;
      }
    } catch (error) {
      // Not enrolled, check for pending requests
      try {
        const requestsResponse = await api.get('/enrollment-requests/student');
        const pendingRequest = requestsResponse.data.data.find(
          req => req.course._id === id && req.status === 'pending'
        );
        if (pendingRequest) {
          setEnrollmentStatus('pending');
        } else {
          setEnrollmentStatus('not_enrolled');
        }
      } catch (error) {
        setEnrollmentStatus('not_enrolled');
      }
    }
  };

  const handleEnrollmentRequest = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to request enrollment');
      return;
    }

    setSubmittingRequest(true);
    try {
      await api.post('/enrollment-requests', {
        courseId: id,
        message: requestMessage
      });
      
      toast.success('Enrollment request submitted successfully!');
      setEnrollmentStatus('pending');
      setShowRequestModal(false);
      setRequestMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit enrollment request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleDirectEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll');
      return;
    }

    try {
      await api.post(`/courses/${id}/enroll`);
      toast.success('Enrolled successfully!');
      setEnrollmentStatus('enrolled');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    }
  };

  const renderEnrollmentButton = () => {
    if (!isAuthenticated) {
      return (
        <Link 
          to="/login" 
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition mb-4 text-center block"
        >
          Login to Enroll
        </Link>
      );
    }

    if (user?.role === 'teacher' && course?.instructor?._id === user?.id) {
      return (
        <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold mb-4 text-center">
          Your Course
        </div>
      );
    }

    switch (enrollmentStatus) {
      case 'enrolled':
        return (
          <Link 
            to={`/courses/${id}/play`}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-4 text-center block flex items-center justify-center"
          >
            <FaPlay className="mr-2" />
            Start Learning
          </Link>
        );
      
      case 'pending':
        return (
          <div className="w-full bg-yellow-100 text-yellow-800 py-3 rounded-lg font-semibold mb-4 text-center">
            Request Pending
          </div>
        );
      
      case 'not_enrolled':
      default:
        return (
          <div className="space-y-2 mb-4">
            <button 
              onClick={handleDirectEnroll}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Enroll Now
            </button>
            <button 
              onClick={() => setShowRequestModal(true)}
              className="w-full bg-white border border-primary-600 text-primary-600 py-2 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center justify-center"
            >
              <FaPaperPlane className="mr-2" />
              Request Enrollment
            </button>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-600 text-sm rounded-full">
                  {course.category}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-medium">{course.rating || 0}</span>
                  <span className="ml-1">({course.numReviews || 0} reviews)</span>
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-1" />
                  <span>{course.students?.length || 0} students</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{Math.floor((course.totalDuration || 0) / 60)} hours</span>
                </div>
              </div>
            </div>
            
            {/* Course Card */}
            <div className="bg-white border rounded-lg p-6 h-fit">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <FaPlay className="text-4xl text-gray-400" />
              </div>
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {course.isFree ? 'Free' : `$${course.price}`}
                </div>
              </div>
              
              {renderEnrollmentButton()}
              
              <div className="text-center text-sm text-gray-500">
                30-day money-back guarantee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Course Curriculum */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
              
              <div className="space-y-4">
                {lessons.length > 0 ? lessons.map((lesson, index) => (
                  <div key={lesson._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                          {lesson.order || index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          <p className="text-sm text-gray-500">{Math.floor((lesson.duration || 0) / 60)} min</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {lesson.isFree ? (
                          <span className="text-green-600 text-sm font-medium">Free</span>
                        ) : (
                          <FaLock className="text-gray-400" />
                        )}
                        <FaPlay className="text-primary-600" />
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-8">No lessons available yet.</p>
                )}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructor</h2>
              
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaUsers className="text-gray-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.instructor?.name || 'Unknown Instructor'}
                  </h3>
                  <p className="text-gray-600">
                    {course.instructor?.bio || 'No bio available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll learn</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {course.learningOutcomes?.length > 0 ? (
                  course.learningOutcomes.map((outcome, index) => (
                    <li key={index}>• {outcome}</li>
                  ))
                ) : (
                  <>
                    <li>• Comprehensive understanding of the subject</li>
                    <li>• Practical skills and knowledge</li>
                    <li>• Interactive learning experience</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Request Enrollment
            </h3>
            <p className="text-gray-600 mb-4">
              Send a message to the instructor requesting enrollment in this course.
            </p>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Optional: Add a message to your request..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 resize-none"
              rows="4"
              maxLength="500"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                disabled={submittingRequest}
              >
                Cancel
              </button>
              <button
                onClick={handleEnrollmentRequest}
                disabled={submittingRequest}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center"
              >
                {submittingRequest ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;