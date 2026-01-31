import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaClock, FaTrophy, FaChartLine } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    hoursLearned: 0,
    certificates: 0,
    progress: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // For now, we'll use mock data since we don't have enrollment endpoints yet
      setStats({
        enrolledCourses: user?.enrolledCourses?.length || 0,
        hoursLearned: 24,
        certificates: 2,
        progress: 78
      });
      setRecentCourses([]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Continue your Islamic learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaBook className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-semibold">{stats.enrolledCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaClock className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Hours Learned</p>
                <p className="text-2xl font-semibold">{stats.hoursLearned}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaTrophy className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Certificates</p>
                <p className="text-2xl font-semibold">{stats.certificates}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaChartLine className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-semibold">{stats.progress}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Continue Learning */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
            <div className="space-y-4">
              {recentCourses.length > 0 ? (
                recentCourses.map(course => (
                  <div key={course._id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FaBook className="text-primary-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-gray-600">Continue learning</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No enrolled courses yet.</p>
                  <a href="/courses" className="text-primary-600 hover:text-primary-700 font-medium">
                    Browse courses to get started
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="ml-3 text-sm">Completed "Arabic Alphabet" lesson</p>
                <span className="ml-auto text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="ml-3 text-sm">Started "Quran Recitation" course</p>
                <span className="ml-auto text-xs text-gray-500">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;