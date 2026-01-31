import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaUsers, 
  FaChartBar,
  FaBook,
  FaClock,
  FaStar,
  FaPlay
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, draft

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await api.get('/courses?instructor=me');
      setCourses(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter(course => course._id !== courseId));
      toast.success('Course deleted successfully');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const togglePublishStatus = async (courseId, currentStatus) => {
    try {
      await api.put(`/courses/${courseId}`, { isPublished: !currentStatus });
      setCourses(courses.map(course => 
        course._id === courseId 
          ? { ...course, isPublished: !currentStatus }
          : course
      ));
      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      toast.error('Failed to update course status');
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'published') return course.isPublished;
    if (filter === 'draft') return !course.isPublished;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">Manage your courses and track student progress</p>
          </div>
          <Link
            to="/create-course"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center"
          >
            <FaPlus className="mr-2" />
            Create New Course
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Courses', count: courses.length },
                { key: 'published', label: 'Published', count: courses.filter(c => c.isPublished).length },
                { key: 'draft', label: 'Drafts', count: courses.filter(c => !c.isPublished).length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No courses yet' : `No ${filter} courses`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start creating your first course to share your knowledge with students.'
                : `You don't have any ${filter} courses at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Link
                to="/create-course"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition inline-flex items-center"
              >
                <FaPlus className="mr-2" />
                Create Your First Course
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Course Thumbnail */}
                <div className="h-48 bg-gray-200 relative">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBook className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      course.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      {course.students?.length || 0} students
                    </div>
                    <div className="flex items-center">
                      <FaStar className="mr-1 text-yellow-400" />
                      {course.rating || 0} ({course.numReviews || 0})
                    </div>
                  </div>

                  {/* Course Meta */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs rounded">
                      {course.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {course.level}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {course.isFree ? 'Free' : `$${course.price}`}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link
                        to={`/courses/${course._id}/play`}
                        className="p-2 text-gray-600 hover:text-green-600 transition"
                        title="Play Course"
                      >
                        <FaPlay />
                      </Link>
                      <Link
                        to={`/courses/${course._id}`}
                        className="p-2 text-gray-600 hover:text-primary-600 transition"
                        title="View Course"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/courses/${course._id}/manage`}
                        className="p-2 text-gray-600 hover:text-blue-600 transition"
                        title="Manage Course"
                      >
                        <FaEdit />
                      </Link>
                      <Link
                        to={`/courses/${course._id}/analytics`}
                        className="p-2 text-gray-600 hover:text-green-600 transition"
                        title="View Analytics"
                      >
                        <FaChartBar />
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition"
                        title="Delete Course"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => togglePublishStatus(course._id, course.isPublished)}
                      className={`px-3 py-1 text-xs font-medium rounded transition ${
                        course.isPublished
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {course.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;