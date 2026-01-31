const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const startApplication = async () => {
  console.log('🚀 STARTING SAFOUA ACADEMY APPLICATION...\n');

  // Check if .env exists
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file...');
    const envContent = `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/safoua-academy
JWT_SECRET=safoua_academy_jwt_secret_key_2024_development_super_secure
JWT_REFRESH_SECRET=safoua_academy_refresh_secret_key_2024_development_super_secure
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@safouaacademy.com
EMAIL_PASSWORD=dummy_password
EMAIL_FROM=noreply@safouaacademy.com
CLOUDINARY_CLOUD_NAME=safoua-academy
CLOUDINARY_API_KEY=dummy_key
CLOUDINARY_API_SECRET=dummy_secret
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=52428800
MAX_VIDEO_SIZE=524288000
MAX_AUDIO_SIZE=104857600`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created');
  }

  // Initialize database
  console.log('🗄️  Initializing database...');
  const initProcess = spawn('node', ['scripts/initialize.js'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  initProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Database initialized successfully');
      console.log('\n🚀 Starting server...');
      
      // Start the server
      const serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });

      serverProcess.on('close', (code) => {
        console.log(`Server process exited with code ${code}`);
      });

    } else {
      console.log(`❌ Database initialization failed with code ${code}`);
    }
  });
};

startApplication();