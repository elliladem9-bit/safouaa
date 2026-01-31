import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaUpload, 
  FaSave,
  FaEye,
  FaFileAlt,
  FaVolumeUp,
  FaVideo,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CreateLesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  
  const [lessonData, setLessonData] = useState({
    title: '',
    content: '',
    order: 1,
    duration: 0,
    isFree: false,
    isPublished: false
  });

  const [files, setFiles] = useState({
    video: null,
    audio: null,
    documents: []
  });

  const [previews, setPreviews] = useState({
    video: null,
    audio: null
  });

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data.data);
      
      // Set next order number
      const nextOrder = response.data.data.lessons.length + 1;
      setLessonData(prev => ({ ...prev, order: nextOrder }));
    } catch (error) {
      toast.error('Failed to fetch course details');
      navigate('/my-courses');
    }
  };

  const handleInputChange = (field, value) => {
    setLessonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (type, file) => {
    setFiles(prev => ({
      ...prev,
      [type]: file
    }));

    // Create preview for video/audio
    if (type === 'video' || type === 'audio') {
      const url = URL.createObjectURL(file);
      setPreviews(prev => ({
        ...prev,
        [type]: url
      }));
    }
  };

  const handleDocumentAdd = (file) => {
    setFiles(prev => ({
      ...prev,
      documents: [...prev.documents, file]
    }));
  };

  const handleDocumentRemove = (index) => {
    setFiles(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (publish = false) => {
    setLoading(true);
    
    try {
      // Validate required fields
      if (!lessonData.title.trim()) {
        toast.error('Lesson title is required');
        return;
      }
      
      if (!lessonData.content.trim()) {
        toast.error('Lesson content is required');
        return;
      }

      // Create lesson
      const lessonPayload = {
        ...lessonData,
        course: courseId,
        isPublished: publish
      };

      const response = await api.post('/lessons', lessonPayload);
      const lessonId = response.data.data._id;

      // Upload files if provided
      const uploadPromises = [];

      if (files.video) {
        const videoFormData = new FormData();
        videoFormData.append('video', files.video);
        uploadPromises.push(
          api.post(`/lessons/${lessonId}/video`, videoFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      if (files.audio) {
        const audioFormData = new FormData();
        audioFormData.append('audio', files.audio);
        uploadPromises.push(
          api.post(`/lessons/${lessonId}/audio`, audioFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      // Upload documents
      files.documents.forEach((doc, index) => {
        const docFormData = new FormData();
        docFormData.append('document', doc);
        docFormData.append('title', doc.name);
        uploadPromises.push(
          api.post(`/lessons/${lessonId}/document`, docFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      });

      // Wait for all uploads to complete
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      toast.success(`Lesson ${publish ? 'created and published' : 'saved as draft'} successfully!`);
      navigate(`/courses/${courseId}/manage`);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Lesson</h1>
          <p className="text-gray-600">Course: {course.title}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Lesson Information</h2>
            
            {/* Lesson Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                value={lessonData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Introduction to Tajweed Rules"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                maxLength="100"
              />
              <p className="text-sm text-gray-500 mt-1">{lessonData.title.length}/100 characters</p>
            </div>

            {/* Lesson Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Content *
              </label>
              <textarea
                value={lessonData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Describe the lesson content, objectives, and key points..."
                rows="8"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Order and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Order
                </label>
                <input
                  type="number"
                  value={lessonData.order}
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={lessonData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access
                </label>
                <select
                  value={lessonData.isFree}
                  onChange={(e) => handleInputChange('isFree', e.target.value === 'true')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={false}>Premium</option>
                  <option value={true}>Free Preview</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Media Content</h2>
            
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Content
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {previews.video ? (
                  <div className="text-center">
                    <video 
                      src={previews.video} 
                      controls 
                      className="mx-auto h-48 rounded-lg mb-4"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviews(prev => ({ ...prev, video: null }));
                        setFiles(prev => ({ ...prev, video: null }));
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove Video
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <FaVideo className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Upload a video</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileChange('video', e.target.files[0])}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">MP4, WebM, MOV, AVI up to 500MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio Content
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {previews.audio ? (
                  <div className="text-center">
                    <audio 
                      src={previews.audio} 
                      controls 
                      className="mx-auto mb-4"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviews(prev => ({ ...prev, audio: null }));
                        setFiles(prev => ({ ...prev, audio: null }));
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove Audio
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <FaVolumeUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Upload audio</span>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleFileChange('audio', e.target.files[0])}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">MP3, WAV, M4A, AAC up to 100MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents (PDFs, etc.)
              </label>
              
              {/* Document List */}
              {files.documents.length > 0 && (
                <div className="mb-4 space-y-2">
                  {files.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FaFileAlt className="text-gray-400 mr-3" />
                        <span className="text-sm text-gray-700">{doc.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDocumentRemove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                      <span>Upload documents</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                        onChange={(e) => handleDocumentAdd(e.target.files[0])}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, PPT up to 20MB each</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(`/courses/${courseId}/manage`)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
              >
                <FaSave className="mr-2" />
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center"
              >
                <FaEye className="mr-2" />
                {loading ? 'Publishing...' : 'Publish Lesson'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;