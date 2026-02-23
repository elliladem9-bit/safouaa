import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaEnvelope, FaUser, FaCalendar, FaBook, FaChalkboardTeacher, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/profile');
      setProfile(response.data.data);
      
      // Fetch enrolled courses for students
      if (response.data.data.role === 'student') {
        const enrollmentsRes = await api.get('/enrollments/my-enrollments');
        setEnrolledCourses(enrollmentsRes.data.data || []);
      }
      
      // Fetch created courses for teachers
      if (response.data.data.role === 'teacher') {
        const coursesRes = await api.get('/courses/my-courses');
        setCreatedCourses(coursesRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      student: 'bg-blue-100 text-blue-800',
      teacher: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800'
    };
    return badges[role] || badges.student;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: FaCheckCircle, text: 'Rejected' },
      none: { color: 'bg-gray-100 text-gray-800', icon: FaUser, text: 'Not Applied' }
    };
    return badges[status] || badges.none;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
              <div className="relative">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                    <FaUser className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(profile.role)}`}>
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                      </span>
                      {profile.isVerified && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 flex items-center space-x-1">
                          <FaCheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Link
                    to="/profile/edit"
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <FaEnvelope className="mr-2 text-gray-400" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaCalendar className="mr-2 text-gray-400" />
                <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {profile.bio && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Application Status */}
        {profile.role === 'student' && profile.teacherApplicationStatus !== 'none' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Teacher Application Status</h2>
            <div className="flex items-center space-x-3">
              {(() => {
                const status = getStatusBadge(profile.teacherApplicationStatus);
                const Icon = status.icon;
                return (
                  <>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.color} flex items-center space-x-2`}>
                      <Icon className="w-4 h-4" />
                      <span>{status.text}</span>
                    </span>
                  </>
                );
              })()}
            </div>
            {profile.teacherApplicationMessage && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">{profile.teacherApplicationMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Teacher Information */}
        {profile.role === 'teacher' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaChalkboardTeacher className="mr-2 text-primary-600" />
              Teacher Information
            </h2>
            
            {profile.qualifications && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Qualifications</h3>
                <p className="text-gray-600">{profile.qualifications}</p>
              </div>
            )}
            
            {profile.teachingExperience && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Teaching Experience</h3>
                <p className="text-gray-600">{profile.teachingExperience}</p>
              </div>
            )}
          </div>
        )}

        {/* Enrolled Courses (Students) */}
        {profile.role === 'student' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaBook className="mr-2 text-primary-600" />
              My Enrolled Courses ({enrolledCourses.length})
            </h2>
            
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolledCourses.map((enrollment) => (
                  <Link
                    key={enrollment._id}
                    to={`/courses/${enrollment.course._id}`}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    {enrollment.course.thumbnail && (
                      <img
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 mb-2">{enrollment.course.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress: {enrollment.progress}%</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        enrollment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {enrollment.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaBook className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Created Courses (Teachers) */}
        {profile.role === 'teacher' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaChalkboardTeacher className="mr-2 text-primary-600" />
              My Courses ({createdCourses.length})
            </h2>
            
            {createdCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {createdCourses.map((course) => (
                  <Link
                    key={course._id}
                    to={`/teacher/courses/${course._id}`}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{course.enrolledStudents || 0} students</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaChalkboardTeacher className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">You haven't created any courses yet</p>
                <Link
                  to="/teacher/courses/create"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Create Course
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;