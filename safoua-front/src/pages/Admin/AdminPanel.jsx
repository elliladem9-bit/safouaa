import { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaBook, 
  FaChartLine, 
  FaUserGraduate,
  FaUserTie,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaUserPlus,
  FaCrown
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    pendingTeachers: 0,
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0
  });
  const [teacherApplications, setTeacherApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      await Promise.all([
        fetchAnalytics(),
        fetchTeacherApplications(),
        fetchUsers()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setStats(response.data.data.overview);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchTeacherApplications = async () => {
    try {
      const response = await api.get('/admin/teacher-applications?status=pending');
      setTeacherApplications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching teacher applications:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users?limit=50');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleTeacherApplicationResponse = async (userId, status, adminResponse = '') => {
    try {
      await api.put(`/admin/teacher-applications/${userId}/respond`, {
        status,
        adminResponse
      });
      
      toast.success(`Teacher application ${status} successfully`);
      fetchTeacherApplications();
      fetchAnalytics();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to respond to application');
    }
  };

  const handlePromoteToTeacher = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/promote-teacher`);
      toast.success('User promoted to teacher successfully');
      fetchUsers();
      fetchAnalytics();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to promote user');
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage users, courses, and platform settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaUserGraduate className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaUserTie className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaBook className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
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
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Teacher Applications ({teacherApplications.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Published Courses</span>
                        <span className="font-semibold">{stats.publishedCourses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Enrollments</span>
                        <span className="font-semibold">{stats.totalEnrollments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending Teachers</span>
                        <span className="font-semibold text-yellow-600">{stats.pendingTeachers}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Teacher Applications</h3>
                    <div className="space-y-3">
                      {teacherApplications.slice(0, 3).map((application) => (
                        <div key={application._id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{application.name}</p>
                            <p className="text-sm text-gray-500">{application.email}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleTeacherApplicationResponse(application._id, 'approved')}
                              className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={() => handleTeacherApplicationResponse(application._id, 'rejected')}
                              className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                            >
                              <FaTimesCircle />
                            </button>
                          </div>
                        </div>
                      ))}
                      {teacherApplications.length === 0 && (
                        <p className="text-gray-500 text-center">No pending applications</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Teacher Applications</h3>
                <div className="space-y-4">
                  {teacherApplications.map((application) => (
                    <div key={application._id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <FaUserTie className="text-gray-400 text-xl" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{application.name}</h4>
                              <p className="text-gray-600">{application.email}</p>
                            </div>
                          </div>
                          
                          {application.teacherApplicationMessage && (
                            <div className="mb-3">
                              <p className="font-medium text-gray-700 mb-1">Application Message:</p>
                              <p className="text-gray-600 text-sm">{application.teacherApplicationMessage}</p>
                            </div>
                          )}
                          
                          {application.qualifications && (
                            <div className="mb-3">
                              <p className="font-medium text-gray-700 mb-1">Qualifications:</p>
                              <p className="text-gray-600 text-sm">{application.qualifications}</p>
                            </div>
                          )}
                          
                          {application.teachingExperience && (
                            <div className="mb-3">
                              <p className="font-medium text-gray-700 mb-1">Teaching Experience:</p>
                              <p className="text-gray-600 text-sm">{application.teachingExperience}</p>
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-500">
                            Applied {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex space-x-3 ml-6">
                          <button
                            onClick={() => handleTeacherApplicationResponse(application._id, 'approved')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
                          >
                            <FaCheckCircle />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleTeacherApplicationResponse(application._id, 'rejected')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
                          >
                            <FaTimesCircle />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {teacherApplications.length === 0 && (
                    <div className="text-center py-12">
                      <FaUserTie className="text-gray-300 text-4xl mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applications</h3>
                      <p className="text-gray-500">Teacher applications will appear here when submitted.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                  <div className="flex space-x-2">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="">All Roles</option>
                      <option value="student">Students</option>
                      <option value="teacher">Teachers</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {user.profilePicture ? (
                                  <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full" />
                                ) : (
                                  <FaUsers className="text-gray-400" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800'
                                : user.role === 'teacher'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isVerified 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-primary-600 hover:text-primary-900">
                                <FaEye />
                              </button>
                              {user.role === 'student' && (
                                <button
                                  onClick={() => handlePromoteToTeacher(user._id)}
                                  className="text-purple-600 hover:text-purple-900"
                                  title="Promote to Teacher"
                                >
                                  <FaCrown />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {users.length === 0 && (
                  <div className="text-center py-12">
                    <FaUsers className="text-gray-300 text-4xl mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">Users will appear here as they register.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;