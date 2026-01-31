import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaQuran, FaGraduationCap, FaUsers, FaStar, FaPlay } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Learn Islam Online
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Master Quran, Arabic, and Islamic Sciences with qualified teachers at Safoua Academy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
                  >
                    Start Learning Today
                  </Link>
                  <Link
                    to="/courses"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition transform hover:scale-105"
                  >
                    Browse Courses
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/courses"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition transform hover:scale-105"
                  >
                    Browse Courses
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive Islamic education with modern learning tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaQuran className="text-2xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Quran Recitation</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn proper Tajweed with audio guidance and teacher feedback
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-2xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Arabic Language</h3>
              <p className="text-gray-600 leading-relaxed">
                Master Arabic from basics to advanced with interactive lessons
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGraduationCap className="text-2xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Islamic Sciences</h3>
              <p className="text-gray-600 leading-relaxed">
                Study Hadith, Fiqh, Tafsir, and other Islamic sciences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Course Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive curriculum
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Quran', icon: FaQuran, color: 'bg-green-500' },
              { name: 'Arabic', icon: FaBook, color: 'bg-blue-500' },
              { name: 'Hadith', icon: FaGraduationCap, color: 'bg-purple-500' },
              { name: 'Fiqh', icon: FaStar, color: 'bg-orange-500' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/courses?category=${category.name}`}
                className="group p-4 md:p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 ${category.color} rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="text-white text-lg md:text-xl" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
              <div className="text-primary-200 text-sm md:text-base">Students</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-200 text-sm md:text-base">Qualified Teachers</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold mb-2">100+</div>
              <div className="text-primary-200 text-sm md:text-base">Courses</div>
            </div>
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-200 text-sm md:text-base">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students learning Islam online at Safoua Academy
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition inline-flex items-center space-x-2 transform hover:scale-105"
            >
              <span>Get Started Now</span>
              <FaPlay className="text-sm" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;