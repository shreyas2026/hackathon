import React, { useState } from 'react';
import style from './Flag.module.css';
import wave from './wave.svg';
import wave2 from './wave2.svg';

const stroke = () => {
  const strokes = [];
  for (let index = 0; index < 24; index++) {
    let deg = 15 * index;
    strokes.push(
      <div
        key={index}
        className={style.stroke}
        style={{ transform: `translate(-50%, -100%) rotate(${deg}deg)` }}
      ></div>
    );
  }
  return strokes;
};

const IndianEmblem = () => (
  <div className={style.emblemContainer}>
    <div className={style.chakra}>
      <div className={style.chakraInner}>
        {stroke()}
      </div>
    </div>
  </div>
);

const PrimarySchoolProfile = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [showQuote, setShowQuote] = useState(false);

  const badges = [
    { name: 'Eco Kids', description: 'Environmental Awareness Club' },
    { name: 'Little Innovators', description: 'Science & Tech Explorers' },
    { name: 'Creative Arts', description: 'Art & Craft Club' },
    { name: 'Sports Champs', description: 'Physical Activity & Teamwork' }
  ];

  const achievements = [
    'Best Primary School Award 2023',
    'Excellence in Co-Curricular Activities',
    'Inter-School Sports Champions',
    'Innovative Learning Award'
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* Header with Emblem */}
      <div className="flex items-center justify-center space-x-8 bg-white p-6 rounded-lg shadow-md">
        <IndianEmblem />
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-900">Satyameva Vidya</h1>
          <h2 className="text-2xl font-semibold text-orange-600">ಸತ್ಯಮೇವ ಜಯತೆ</h2>
          <p className="text-lg text-gray-600">Government of Karnataka</p>
        </div>
        <IndianEmblem />
      </div>

      {/* School Title Card */}
      <div
        className="bg-white rounded-lg shadow-md p-8 text-center transform transition-all duration-300 hover:shadow-xl"
        onMouseEnter={() => setShowQuote(true)}
        onMouseLeave={() => setShowQuote(false)}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            Bengaluru Government Primary School
          </h1>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className="px-3 py-1 bg-blue-100 rounded-full text-blue-800">
              Est. 1980
            </span>
            <span className="px-3 py-1 bg-green-100 rounded-full text-green-800">
              Karnataka State Board
            </span>
            <span className="px-3 py-1 bg-purple-100 rounded-full text-purple-800">
              ISO 9001 Certified
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Mr Prajwal    M.Ed.
          </h2>
          <p className="text-xl text-gray-600">Principal</p>
          <div
            className={`transition-all duration-500 overflow-hidden ${
              showQuote ? 'h-20 opacity-100' : 'h-0 opacity-0'
            }`}
          >
            <p className="italic text-gray-600 mt-4">
              "Nurturing curiosity and creativity, building a better future - ಕುತೂಹಲ ಮತ್ತು ಸೃಜನಶೀಲತೆಯಿಂದ ಭವಿಷ್ಯ ನಿರ್ಮಾಣ"
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b bg-white rounded-t-lg p-2">
        {['about', 'academics', 'activities', 'achievements', 'facilities'].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-6 rounded-full transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* About Section */}
        <div
          className={`transition-all duration-500 ${
            activeTab === 'about' ? 'block' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Vision
              </h3>
              <p className="text-gray-700">
                To cultivate a lifelong love for learning and holistic development in every child.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Mission
              </h3>
              <p className="text-gray-700">
                To provide a nurturing, inclusive environment that fosters creativity, critical thinking, and social responsibility.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                Values
              </h3>
              <p className="text-gray-700">
                Integrity, Respect, Curiosity, and Compassion.
              </p>
            </div>
          </div>
        </div>

        {/* Academics Section */}
        <div
          className={`transition-all duration-500 ${
            activeTab === 'academics' ? 'block' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                Academic Excellence
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>State Board Results: Over 95% pass rate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Dedicated & Caring Teaching Staff</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Interactive Digital Classrooms</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Holistic, Activity-based Learning</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                Curriculum Programs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Language & Literacy</h4>
                  <p className="text-sm text-gray-600">
                    Emphasis on Kannada, English & Hindi
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">Mathematics</h4>
                  <p className="text-sm text-gray-600">
                    Concept-based learning & problem solving
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Science & Environment</h4>
                  <p className="text-sm text-gray-600">
                    Hands-on experiments & outdoor learning
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800">Social Studies</h4>
                  <p className="text-sm text-gray-600">
                    Exploring community & cultural heritage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div
          className={`transition-all duration-500 ${
            activeTab === 'activities' ? 'block' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                Student Organizations
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg transform transition-all duration-300 hover:scale-105"
                  >
                    <h4 className="font-semibold text-blue-800">{badge.name}</h4>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                Co-Curricular Activities
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center p-2 rounded-lg transition-all duration-300 hover:bg-blue-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  <span>Annual Sports Day</span>
                </li>
                <li className="flex items-center p-2 rounded-lg transition-all duration-300 hover:bg-blue-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  <span>Art & Craft Exhibition</span>
                </li>
                <li className="flex items-center p-2 rounded-lg transition-all duration-300 hover:bg-blue-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  <span>Science Fair & Fun Workshops</span>
                </li>
                <li className="flex items-center p-2 rounded-lg transition-all duration-300 hover:bg-blue-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  <span>Cultural Day Celebrations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div
          className={`transition-all duration-500 ${
            activeTab === 'achievements' ? 'block' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                Recent Achievements
              </h3>
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg transform transition-all duration-300 hover:scale-105"
                >
                  <span className="text-blue-800">{achievement}</span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                Student Highlights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg">
                  <h4 className="font-semibold text-green-800">
                    Young Innovators Award
                  </h4>
                  <p className="text-gray-600">Celebrating creative problem solving</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg">
                  <h4 className="font-semibold text-purple-800">Art Contest Winners</h4>
                  <p className="text-gray-600">Recognizing excellence in creativity</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-white rounded-lg">
                  <h4 className="font-semibold text-orange-800">Sports Day Champions</h4>
                  <p className="text-gray-600">Outstanding performance in inter-school games</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg">
                  <h4 className="font-semibold text-blue-800">Quiz Competition Winners</h4>
                  <p className="text-gray-600">Excellence in academic competitions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities Section */}
        <div
          className={`transition-all duration-500 ${
            activeTab === 'facilities' ? 'block' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Academic Facilities
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Modern Classrooms with Smart Boards</span>
                </li>
                <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Library with Kid-Friendly Books & Digital Resources</span>
                </li>
                <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Interactive Learning Labs</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Sports Facilities
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Spacious Playground</span>
                </li>
                <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Indoor Games & Activity Area</span>
                </li>
                <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Multipurpose Sports Field</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Additional Facilities
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Counseling & Guidance Center</span>
                </li>
                <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Cafeteria with Nutritious Meals</span>
                </li>
                <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Safe Transport Services</span>
                </li>
                <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Parent-Teacher Meeting Rooms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimarySchoolProfile;
