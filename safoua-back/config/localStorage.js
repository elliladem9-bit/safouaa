const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const profilePicturesDir = path.join(uploadsDir, 'profile-pictures');
const courseThumbnailsDir = path.join(uploadsDir, 'course-thumbnails');
const lessonsDir = path.join(uploadsDir, 'lessons');

// Create directories
[uploadsDir, profilePicturesDir, courseThumbnailsDir, lessonsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Save file locally
const saveFile = async (file, folder = 'profile-pictures') => {
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.originalname.replace(/\s+/g, '-')}`;
  const filepath = path.join(uploadsDir, folder, filename);
  
  // Write file
  fs.writeFileSync(filepath, file.buffer);
  
  // Return URL
  const url = `/uploads/${folder}/${filename}`;
  return { secure_url: url, public_id: filename };
};

module.exports = { saveFile, uploadsDir };
