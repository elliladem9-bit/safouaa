import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBook, 
  FaUpload, 
  FaPlus, 
  FaTrash, 
  FaSave,
  FaEye,
  FaFileAlt,
  FaVolumeUp,
  FaImage
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'Quran',
    level: 'Beginner',
    language: 'English',
    price: 0,
    isFree: true,
    thumbnail: null,
    learningOutcomes: [''],
    requirements: [''],
    isPublished: false
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const categories = [
    'Quran',
    'Arabic',
    'Islamic Sciences',
    'Hadith',
    'Fiqh',
    'Tafsir',
    'Other'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const languages = ['English', 'Arabic', 'French', 'Urdu'];

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData(prev => ({ ...prev, thumbnail: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (publish = false) => {
    setLoading(true);
    
    try {
      // Validate required fields
      if (!courseData.title.trim()) {
        toast.error('Course title is required');
        return;
      }
      
      if (!courseData.description.trim()) {
        toast.error('Course description is required');
        return;
      }

      // Filter out empty learning outcomes and requirements
      const filteredData = {
        ...courseData,
        learningOutcomes: courseData.learningOutcomes.filter(item => item.trim()),
        requirements: courseData.requirements.filter(item => item.trim()),
        isPublished: publish
      };

      // Remove thumbnail from course data (we'll upload it separately)
      delete filteredData.thumbnail;

      // Create course
      const response = await api.post('/courses', filteredData);
      const courseId = response.data.data._id;

      // Upload thumbnail if provided
      if (courseData.thumbnail) {
        const formData = new FormData();
        formData.append('thumbnail', courseData.thumbnail);
        
        try {
          await api.post(`/courses/${courseId}/thumbnail`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } catch (uploadError) {
          console.warn('Thumbnail upload failed:', uploadError);
          // Don't fail the entire process for thumbnail upload
        }
      }

      toast.success(`Course ${publish ? 'created and published' : 'saved as draft'} successfully!`);
      navigate('/my-courses');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
          <p className="text-gray-600">Share your knowledge with students around the world</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="ml-3">
                  <p className={`font-medium ${
                    currentStep >= step ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Course Details'}
                    {step === 3 && 'Review & Publish'}
                  </p>
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Course Information</h2>
              
              {/* Course Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Introduction to Quran Recitation"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  maxLength="100"
                />
                <p className="text-sm text-gray-500 mt-1">{courseData.title.length}/100 characters</p>
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description *
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what students will learn in this course..."
                  rows="5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  maxLength="2000"
                />
                <p className="text-sm text-gray-500 mt-1">{courseData.description.length}/2000 characters</p>
              </div>

              {/* Category and Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={courseData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level *
                  </label>
                  <select
                    value={courseData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Language and Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={courseData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {languages.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={courseData.isFree}
                        onChange={() => {
                          handleInputChange('isFree', true);
                          handleInputChange('price', 0);
                        }}
                        className="mr-2"
                      />
                      Free Course
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!courseData.isFree}
                        onChange={() => handleInputChange('isFree', false)}
                        className="mr-2"
                      />
                      Paid Course
                    </label>
                    {!courseData.isFree && (
                      <div className="ml-6">
                        <input
                          type="number"
                          value={courseData.price}
                          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <span className="ml-2 text-gray-600">USD</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Course Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Details</h2>
              
              {/* Course Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Thumbnail
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {thumbnailPreview ? (
                    <div className="text-center">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="mx-auto h-32 w-48 object-cover rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailPreview(null);
                          setCourseData(prev => ({ ...prev, thumbnail: null }));
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What will students learn?
                </label>
                <div className="space-y-3">
                  {courseData.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => handleArrayChange('learningOutcomes', index, e.target.value)}
                        placeholder="e.g., Understand basic Tajweed rules"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {courseData.learningOutcomes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('learningOutcomes', index)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('learningOutcomes')}
                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <FaPlus className="mr-2" />
                    Add learning outcome
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Requirements
                </label>
                <div className="space-y-3">
                  {courseData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                        placeholder="e.g., Basic understanding of Arabic letters"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {courseData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('requirements', index)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <FaPlus className="mr-2" />
                    Add requirement
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Publish */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Your Course</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {thumbnailPreview && (
                    <div>
                      <img 
                        src={thumbnailPreview} 
                        alt="Course thumbnail" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{courseData.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{courseData.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-primary-100 text-primary-600 rounded">{courseData.category}</span>
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded">{courseData.level}</span>
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded">{courseData.language}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded">
                        {courseData.isFree ? 'Free' : `$${courseData.price}`}
                      </span>
                    </div>
                  </div>
                </div>

                {courseData.learningOutcomes.filter(item => item.trim()).length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Learning Outcomes:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {courseData.learningOutcomes.filter(item => item.trim()).map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {courseData.requirements.filter(item => item.trim()).length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {courseData.requirements.filter(item => item.trim()).map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• After creating your course, you can add lessons with PDF and audio content</li>
                  <li>• Students can request enrollment, which you can approve or reject</li>
                  <li>• You can track student progress and manage enrollments from your dashboard</li>
                  <li>• Published courses will be visible to all students</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Next
                </button>
              ) : (
                <>
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
                    {loading ? 'Publishing...' : 'Publish Course'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;