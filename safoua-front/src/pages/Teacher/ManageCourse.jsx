import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  FaPlay,
  FaFileAlt,
  FaVolumeUp,
  FaVideo,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ManageCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lessons');

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseResponse, lessonsResponse] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/lessons/course/${courseId}`)
      ]);
      
      setCourse(courseResponse.data.data);
      setLessons(lessonsResponse.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch course data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      await api.delete(`/lessons/${lessonId}`);
      setLessons(lessons.filter(lesson => lesson._id !== lessonId));
      toast.success('Lesson deleted successfully');
    } catch (error) {
      toast.error('Failed to delete lesson');
    }
  };

  const toggleLessonStatus = async (lessonId, currentStatus) => {
    try {
      await api.put(`/lessons/${lessonId}`, { isPublished: !currentStatus });
      setLessons(lessons.map(lesson => 
        lesson._id === lessonId 
          ? { ...lesson, isPublished: !currentStatus }
          : lesson
      ));
      toast.success(`Lesson ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      toast.error('Failed to update lesson status');
    }
  };

  const reorderLesson = async (lessonId, direction) => {
    const currentIndex = lessons.findIndex(l => l._id === lessonId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= lessons.length) return;

    const newOrder = lessons[newIndex].order;
    
    try {
      await api.put(`/lessons/${lessonId}`, { order: newOrder });
      await api.put(`/lessons/${lessons[newIndex]._id}`, { order: lessons[currentIndex].order });
      
      // Update local state
      const updatedLessons = [...lessons];
      [updatedLessons[currentIndex], updatedLessons[newIndex]] = [updatedLessons[newIndex], updatedLessons[currentIndex]];
      setLessons(updatedLessons);
      
      toast.success('Lesson order updated');
    } catch (error) {
      toast.error('Failed to reorder lesson');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <Link to="/my-courses" className="text-primary-600 hover:text-primary-700">
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600">Manage your course content and settings</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/courses/${courseId}/analytics`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
              >
                <FaChartBar className="mr-2" />
                Analytics
              </Link>
              <Link
                to={`/courses/${courseId}/edit`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit Course
              </Link>
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaUsers className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">{course.students?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaBook className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaClock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-2xl font-bold text-gray-900">{course.totalDuration || 0}m</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FaStar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{course.rating || 0}/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'lessons', label: 'Lessons', count: lessons.length },
                { key: 'students', label: 'Students', count: course.students?.length || 0 },
                { key: 'settings', label: 'Settings', count: null }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} {tab.count !== null && `(${tab.count})`}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'lessons' && (
          <div className="space-y-6">
            {/* Add Lesson Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Course Lessons</h2>
              <Link
                to={`/courses/${courseId}/create-lesson`}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Lesson
              </Link>
            </div>

            {/* Lessons List */}
            {lessons.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
                <p className="text-gray-600 mb-6">Start adding lessons to your course.</p>
                <Link
                  to={`/courses/${courseId}/create-lesson`}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition inline-flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Create First Lesson
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => reorderLesson(lesson._id, 'up')}
                            disabled={index === 0}
                            className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-primary-600'}`}
                          >
                            <FaArrowUp />
                          </button>
                          <button
                            onClick={() => reorderLesson(lesson._id, 'down')}
                            disabled={index === lessons.length - 1}
                            className={`p-1 rounded ${index === lessons.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-primary-600'}`}
                          >
                            <FaArrowDown />
                          </button>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-sm font-medium">
                              Lesson {lesson.order}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              lesson.isPublished 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {lesson.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{lesson.content}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <FaClock className="mr-1" />
                              {lesson.duration} min
                            </div>
                            {lesson.videoUrl && (
                              <div className="flex items-center">
                                <FaVideo className="mr-1" />
                                Video
                              </div>
                            )}
                            {lesson.audioUrl && (
                              <div className="flex items-center">
                                <FaVolumeUp className="mr-1" />
                                Audio
                              </div>
                            )}
                            {lesson.documents?.length > 0 && (
                              <div className="flex items-center">
                                <FaFileAlt className="mr-1" />
                                {lesson.documents.length} docs
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/lessons/${lesson._id}`}
                          className="p-2 text-gray-600 hover:text-primary-600 transition"
                          title="Preview Lesson"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/lessons/${lesson._id}/edit`}
                          className="p-2 text-gray-600 hover:text-blue-600 transition"
                          title="Edit Lesson"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition"
                          title="Delete Lesson"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => toggleLessonStatus(lesson._id, lesson.isPublished)}
                          className={`px-3 py-1 text-xs font-medium rounded transition ${
                            lesson.isPublished
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {lesson.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enrolled Students</h2>
            <p className="text-gray-600">Student management will be implemented here</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Settings</h2>
            <p className="text-gray-600">Course settings will be implemented here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourse;