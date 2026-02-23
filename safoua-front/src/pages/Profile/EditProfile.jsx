import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    qualifications: '',
    teachingExperience: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const profile = response.data.data;
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        qualifications: profile.qualifications || '',
        teachingExperience: profile.teachingExperience || ''
      });
      setPreviewUrl(profile.profilePicture || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload profile picture if changed
      let profilePictureUrl = previewUrl;
      if (profilePicture) {
        try {
          setUploading(true);
          const formDataImg = new FormData();
          formDataImg.append('file', profilePicture);
          
          const uploadRes = await api.post('/users/upload-profile-picture', formDataImg, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          profilePictureUrl = uploadRes.data.data.url;
          setUploading(false);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast.warning('Profile updated but image upload failed. Please configure Cloudinary.');
          setUploading(false);
          // Continue without updating profile picture
        }
      }

      // Update profile
      const updateData = {
        ...formData
      };
      
      // Only include profilePicture if it was successfully uploaded or already exists
      if (profilePictureUrl && !profilePicture) {
        updateData.profilePicture = profilePictureUrl;
      } else if (profilePicture && profilePictureUrl !== previewUrl) {
        updateData.profilePicture = profilePictureUrl;
      }

      const response = await api.put('/users/profile', updateData);
      
      // Update auth context
      if (updateUser) {
        updateUser(response.data.data);
      }

      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                    <FaUser className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <label
                  htmlFor="profilePicture"
                  className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition"
                >
                  <FaCamera className="w-4 h-4" />
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">Click the camera icon to change picture</p>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                maxLength="500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell us about yourself..."
              />
              <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
            </div>

            {/* Teacher Fields */}
            {user?.role === 'teacher' && (
              <>
                <div>
                  <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications
                  </label>
                  <textarea
                    id="qualifications"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    rows="4"
                    maxLength="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="List your qualifications and certifications..."
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.qualifications.length}/1000 characters</p>
                </div>

                <div>
                  <label htmlFor="teachingExperience" className="block text-sm font-medium text-gray-700 mb-2">
                    Teaching Experience
                  </label>
                  <textarea
                    id="teachingExperience"
                    name="teachingExperience"
                    value={formData.teachingExperience}
                    onChange={handleChange}
                    rows="4"
                    maxLength="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe your teaching experience..."
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.teachingExperience.length}/1000 characters</p>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading || uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{uploading ? 'Uploading...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;