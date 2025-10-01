import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// FontAwesome library setup (if needed, but for a simple 404, we might use SVG or internal icons)
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// import { library } from '@fortawesome/fontawesome-svg-core';
// library.add(faMagnifyingGlass);

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      {/* Container for the 404 content */}
      <div
        dir="rtl" // Right-to-left for Arabic text
        className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 text-center"
      >
        {/* SVG Icon for visual appeal */}
        <div className="mb-8 flex justify-center">
          <svg
            className="w-32 h-32 textColor animate-bounce-slow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10V7m0 3a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </div>

        {/* 404 Title */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold textColor mb-4 animate-fade-in">
          404
        </h1>

        {/* Message */}
        <p className="text-2xl sm:text-3xl textColor font-semibold mb-6 leading-relaxed">
          عذرًا، لم يتم العثور على الصفحة.
          <br />
        </p>

        {/* Call to action button */}
        <NavLink to={'/'}>
        <button
          onClick={handleGoHome}
          style={{cursor: "pointer"}}
          className="backGroundColor text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          العودة إلى الصفحة الرئيسية
        </button>
        </NavLink>
      </div>

      {/* Tailwind Custom Animation (can be placed in index.css or a global CSS file if not using JIT mode) */}
      <style>
        {`
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15%);
            }
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fadeIn 1.5s ease-out;
          }

          /* Basic font import for Inter (if not already handled globally) */
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          
          /* Adding a general Arabic font fallback, assuming 'Cairo' is desired or similar */
          body {
            font-family: 'Inter', 'Cairo', 'Arial', sans-serif;
          }
        `}
      </style>
    </div>
  );
};

export default NotFoundPage;