const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    image: /jpeg|jpg|png|gif|webp|bmp|svg/,
    video: /mp4|avi|mov|wmv|flv|mkv|webm|m4v|3gp/,
    audio: /mp3|wav|ogg|m4a|aac|flac|wma/,
    document: /pdf|doc|docx|txt|ppt|pptx|xls|xlsx|rtf|odt/
  };

  const extname = path.extname(file.originalname).toLowerCase().slice(1);
  
  let isValid = false;
  let fileType = null;
  
  for (const type in allowedTypes) {
    if (allowedTypes[type].test(extname)) {
      isValid = true;
      fileType = type;
      break;
    }
  }

  if (isValid) {
    // Add file type to request for later use
    req.fileType = fileType;
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: .${extname}. Allowed types: images (jpg, png, gif, webp), videos (mp4, webm, mov), audio (mp3, wav, m4a), documents (pdf, doc, docx, txt, ppt)`));
  }
};

// Create multer upload instances
exports.uploadImage = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB for images
  },
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase().slice(1);
    if (/jpeg|jpg|png|gif|webp/.test(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
}).single('thumbnail'); // Changed from 'image' to 'thumbnail'

exports.uploadVideo = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_VIDEO_SIZE) || 500 * 1024 * 1024 // 500MB for videos
  },
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase().slice(1);
    if (/mp4|avi|mov|wmv|flv|mkv|webm/.test(extname)) { // Added webm
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
}).single('video');

exports.uploadAudio = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_AUDIO_SIZE) || 100 * 1024 * 1024 // 100MB for audio
  },
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase().slice(1);
    if (/mp3|wav|ogg|m4a|aac/.test(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
}).single('audio');

exports.uploadDocument = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024 // 20MB for documents
  },
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase().slice(1);
    if (/pdf|doc|docx|txt|ppt|pptx/.test(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Only document files (PDF, DOC, DOCX, TXT, PPT, PPTX) are allowed'));
    }
  }
}).single('document');

// Flexible upload for any supported file type
exports.uploadAny = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024 // 500MB max
  },
  fileFilter
}).single('file');

exports.uploadMultiple = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024 // 20MB per file
  },
  fileFilter
}).array('files', 10); // Allow up to 10 files
