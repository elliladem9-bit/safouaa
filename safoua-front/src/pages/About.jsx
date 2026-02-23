import { FaQuran, FaBook, FaGraduationCap, FaUsers, FaHeart, FaGlobe, FaStar, FaAward } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Safoua Academy</h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Empowering Muslims worldwide with authentic Islamic knowledge through modern online education
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <FaHeart className="text-3xl text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To provide accessible, high-quality Islamic education to Muslims around the world, 
                helping them deepen their understanding of the Quran, Arabic language, and Islamic sciences. 
                We strive to create a supportive learning environment where students can grow spiritually 
                and intellectually under the guidance of qualified scholars.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <FaGlobe className="text-3xl text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the leading online platform for Islamic education, bridging the gap between 
                traditional Islamic scholarship and modern technology. We envision a global community 
                of learners who are well-versed in Islamic knowledge and equipped to practice and 
                share their faith with confidence and wisdom.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto"></div>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Safoua Academy was founded with a simple yet powerful vision: to make authentic Islamic 
              education accessible to everyone, regardless of their location or circumstances. In an 
              increasingly digital world, we recognized the need for a platform that combines traditional 
              Islamic scholarship with modern educational technology.
            </p>
            <p className="mb-4">
              Our journey began when a group of passionate educators and scholars came together, united 
              by their commitment to spreading Islamic knowledge. They understood that many Muslims around 
              the world face challenges in accessing quality Islamic education due to geographical barriers, 
              time constraints, or lack of qualified teachers in their areas.
            </p>
            <p>
              Today, Safoua Academy serves thousands of students worldwide, offering comprehensive courses 
              in Quran recitation, Arabic language, Islamic sciences, and more. Our platform brings together 
              qualified scholars and eager learners in a dynamic online environment that fosters growth, 
              understanding, and spiritual development.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaQuran className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Authenticity</h3>
              <p className="text-gray-600 text-sm">
                Teaching authentic Islamic knowledge based on the Quran and Sunnah
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaAward className="text-2xl text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Excellence</h3>
              <p className="text-gray-600 text-sm">
                Maintaining the highest standards in education and teaching quality
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Community</h3>
              <p className="text-gray-600 text-sm">
                Building a supportive global community of learners and scholars
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Accessibility</h3>
              <p className="text-gray-600 text-sm">
                Making Islamic education accessible to everyone, everywhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive Islamic education for all levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition">
              <FaQuran className="text-4xl text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Quran Studies</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Tajweed and proper recitation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Quran memorization (Hifz)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Tafsir and understanding</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition">
              <FaBook className="text-4xl text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Arabic Language</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Classical and Modern Arabic</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Grammar and vocabulary</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Reading and writing skills</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition">
              <FaGraduationCap className="text-4xl text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Islamic Sciences</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Hadith studies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Fiqh (Islamic jurisprudence)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>Islamic history and biography</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-primary-200">Active Students</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-primary-200">Qualified Teachers</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <div className="text-primary-200">Courses Available</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">30+</div>
              <div className="text-primary-200">Countries Reached</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Teachers */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Qualified Teachers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from experienced scholars with authentic Islamic knowledge
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Teacher Qualifications</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <FaStar className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <span>Ijazah (certification) in Quran recitation and memorization</span>
                  </li>
                  <li className="flex items-start">
                    <FaStar className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <span>Advanced degrees in Islamic studies from recognized institutions</span>
                  </li>
                  <li className="flex items-start">
                    <FaStar className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <span>Years of teaching experience in their respective fields</span>
                  </li>
                  <li className="flex items-start">
                    <FaStar className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <span>Fluency in Arabic and English (or other languages)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Teaching Approach</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <FaStar className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <span>Student-centered learning methodology</span>
                  </li>
                  <li className="flex items-start">
                    <FaStar className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <span>Interactive and engaging lessons</span>
                  </li>
                  <li className="flex items-start">
                    <FaStar className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <span>Personalized feedback and guidance</span>
                  </li>
                  <li className="flex items-start">
                    <FaStar className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <span>Flexible scheduling to accommodate different time zones</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Learning Community
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start your journey of Islamic learning today with Safoua Academy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/courses"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition inline-block"
            >
              Browse Courses
            </a>
            <a
              href="/register"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;