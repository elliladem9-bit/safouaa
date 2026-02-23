import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaPlay, 
  FaPause, 
  FaVolumeUp, 
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaFileAlt,
  FaVolumeDown,
  FaClock,
  FaCheckCircle,
  FaPlayCircle,
  FaLock,
  FaBook,
  FaHeadphones
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CoursePlayer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('lessons'); // lessons, materials, notes
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId, lessonId]);

  useEffect(() => {
    let timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseResponse = await api.get(`/courses/${courseId}`);
      setCourse(courseResponse.data.data);

      // Fetch lessons
      const lessonsResponse = await api.get(`/lessons/course/${courseId}`);
      setLessons(lessonsResponse.data.data);

      // Find current lesson or set first lesson
      let lesson;
      if (lessonId) {
        lesson = lessonsResponse.data.data.find(l => l._id === lessonId);
      } else {
        lesson = lessonsResponse.data.data[0];
      }
      
      if (lesson) {
        setCurrentLesson(lesson);
        // Update URL if no lessonId was provided
        if (!lessonId) {
          navigate(`/courses/${courseId}/play/${lesson._id}`, { replace: true });
        }
      }

      // Check enrollment status
      try {
        const enrollmentResponse = await api.get(`/enrollments/course/${courseId}`);
        setEnrollment(enrollmentResponse.data.data);
      } catch (error) {
        // User might not be enrolled
        console.log('Not enrolled or enrollment check failed');
      }

    } catch (error) {
      toast.error('Failed to load course data');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const selectLesson = (lesson) => {
    setCurrentLesson(lesson);
    navigate(`/courses/${courseId}/play/${lesson._id}`);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const getNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l._id === currentLesson?._id);
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  };

  const getPreviousLesson = () => {
    const currentIndex = lessons.findIndex(l => l._id === currentLesson?._id);
    return currentIndex > 0 ? lessons[currentIndex - 1] : null;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const openPdfViewer = (document) => {
    setCurrentPdf(document);
    setPdfViewerOpen(true);
  };

  const closePdfViewer = () => {
    setPdfViewerOpen(false);
    setCurrentPdf(null);
  };

  const markLessonComplete = async () => {
    try {
      await api.post(`/progress/lesson/${currentLesson._id}/complete`);
      toast.success('Lesson marked as complete!');
      // Refresh enrollment data to update progress
      fetchCourseData();
    } catch (error) {
      toast.error('Failed to mark lesson as complete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!currentLesson && lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <FaBook className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Lessons Available</h2>
          <p className="text-gray-400 mb-6">
            This course doesn't have any lessons yet. The instructor is still preparing the content.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Course Details
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'mr-80' : ''} transition-all duration-300`}>
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="text-gray-400 hover:text-white transition"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">{course.title}</h1>
              <p className="text-sm text-gray-400">{currentLesson.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition"
            >
              {sidebarOpen ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black relative group">
          {currentLesson.videoUrl ? (
            <div 
              className="relative w-full h-full"
              onMouseMove={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <video
                ref={videoRef}
                src={currentLesson.videoUrl}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={handlePlayPause}
                onError={(e) => {
                  console.error('Video error:', e);
                  toast.error('Failed to load video. Please try again.');
                }}
                crossOrigin="anonymous"
              />
              
              {/* Video Controls */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <div 
                  className="w-full h-2 bg-gray-600 rounded-full mb-4 cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button onClick={handlePlayPause} className="text-white hover:text-primary-400 transition">
                      {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button onClick={toggleMute} className="text-white hover:text-primary-400 transition">
                        {isMuted ? <FaVolumeMute className="w-5 h-5" /> : <FaVolumeUp className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    
                    <span className="text-sm text-gray-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={markLessonComplete}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                    >
                      Mark Complete
                    </button>
                    <button onClick={toggleFullscreen} className="text-white hover:text-primary-400 transition">
                      {isFullscreen ? <FaCompress className="w-5 h-5" /> : <FaExpand className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : currentLesson.audioUrl ? (
            // Audio Player
            <div className="flex items-center justify-center h-full">
              <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                  <FaHeadphones className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{currentLesson.title}</h3>
                  <p className="text-gray-400">Audio Lesson</p>
                </div>
                
                <audio
                  ref={videoRef}
                  src={currentLesson.audioUrl}
                  className="w-full mb-4"
                  controls
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onError={(e) => {
                    console.error('Audio error:', e);
                    toast.error('Failed to load audio. Please try again.');
                  }}
                  crossOrigin="anonymous"
                />
                
                <button
                  onClick={markLessonComplete}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          ) : (
            // Text/Document Lesson
            <div className="flex items-center justify-center h-full">
              <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4">
                <div className="text-center mb-6">
                  <FaBook className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{currentLesson.title}</h3>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {currentLesson.content}
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <button
                    onClick={markLessonComplete}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <button
            onClick={() => getPreviousLesson() && selectLesson(getPreviousLesson())}
            disabled={!getPreviousLesson()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft />
            <span>Previous</span>
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Lesson {lessons.findIndex(l => l._id === currentLesson._id) + 1} of {lessons.length}
            </p>
          </div>
          
          <button
            onClick={() => getNextLesson() && selectLesson(getNextLesson())}
            disabled={!getNextLesson()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex space-x-4">
              {['lessons', 'materials', 'notes'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    activeTab === tab 
                      ? 'bg-primary-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'lessons' && (
              <div className="p-4 space-y-2">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    onClick={() => selectLesson(lesson)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      currentLesson._id === lesson._id 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {lesson.videoUrl ? (
                            <FaPlayCircle className="w-5 h-5" />
                          ) : lesson.audioUrl ? (
                            <FaHeadphones className="w-5 h-5" />
                          ) : (
                            <FaBook className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {index + 1}. {lesson.title}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <FaClock className="w-3 h-3" />
                            <span>{lesson.duration || 0} min</span>
                          </div>
                        </div>
                      </div>
                      {enrollment?.completedLessons?.includes(lesson._id) && (
                        <FaCheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="p-4 space-y-3">
                {currentLesson.documents?.length > 0 ? (
                  currentLesson.documents.map((doc, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FaFileAlt className="w-5 h-5 text-primary-400" />
                          <div>
                            <p className="text-sm font-medium">{doc.title}</p>
                            <p className="text-xs text-gray-400">{doc.fileType}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {doc.fileType === 'application/pdf' && (
                            <button
                              onClick={() => openPdfViewer(doc)}
                              className="text-blue-400 hover:text-blue-300 transition"
                              title="Preview PDF"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                          )}
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300 transition"
                            title="Download"
                          >
                            <FaDownload className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No materials available for this lesson.</p>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="p-4">
                <textarea
                  placeholder="Take notes for this lesson..."
                  className="w-full h-64 bg-gray-700 text-white p-3 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <button className="mt-3 w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition">
                  Save Notes
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {pdfViewerOpen && currentPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 h-5/6 max-w-4xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{currentPdf.title}</h3>
              <div className="flex items-center space-x-3">
                <a
                  href={currentPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition"
                  title="Open in new tab"
                >
                  <FaExpand className="w-5 h-5" />
                </a>
                <a
                  href={currentPdf.url}
                  download
                  className="text-green-600 hover:text-green-700 transition"
                  title="Download"
                >
                  <FaDownload className="w-5 h-5" />
                </a>
                <button
                  onClick={closePdfViewer}
                  className="text-gray-600 hover:text-gray-700 transition"
                >
                  <FaCompress className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* PDF Viewer */}
            <div className="flex-1 p-4">
              <iframe
                src={`${currentPdf.url}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full border rounded"
                title={currentPdf.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;