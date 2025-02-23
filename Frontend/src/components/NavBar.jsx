import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { 
  UserCircle, 
  ClipboardList, 
  BookOpen, 
  LineChart, 
  GraduationCap, 
  LogOut,
  Loader2,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

// Enhanced Toast component with animation
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slideIn`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 animate-pulse" />
      ) : (
        <AlertCircle className="w-5 h-5 animate-pulse" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:scale-110 transition-transform">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Unauthorized Access Component with animations
const UnauthorizedAccess = ({ onNavigate }) => (
  <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full mx-4 animate-fadeIn">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-white animate-slideUp delay-200">Unauthorized Access</h2>
        <p className="text-gray-300 mb-4 animate-slideUp delay-300">
          You are not authorized to access this page. Please log in to continue.
        </p>
        <button
          onClick={onNavigate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 animate-slideUp delay-400"
        >
          Go to Login
        </button>
      </div>
    </div>
  </div>
);

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/verify/verifyLogin`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        showToast('Authentication failed. Please log in.', 'error');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      showToast('Connection error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        showToast('Logout failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      showToast('Connection error. Please try again.', 'error');
    }
  };

  const activeClassName = "flex items-center gap-3 text-lg font-medium text-blue-400 bg-gray-800 p-3 rounded-lg transition-all duration-200 transform hover:scale-105";
  const inactiveClassName = "flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 p-3 rounded-lg transition-all duration-200 transform hover:scale-105";

  if (isLoading) {
    return (
      <div className="w-full h-16 bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <UnauthorizedAccess onNavigate={() => navigate('/')} />;
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <nav className="sticky top-0 z-40 w-full bg-gray-900 shadow-lg border-b border-gray-700 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16">
            {/* Navigation links on the left */}
            <div className="flex items-center space-x-6">
              <NavLink 
                to="/teacher" 
                end
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <UserCircle className="w-5 h-5" />
                <span className="whitespace-nowrap">Profile</span>
              </NavLink>

              <NavLink 
                to="/teacher/attendance" 
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <ClipboardList className="w-5 h-5" />
                <span className="whitespace-nowrap">Fill Attendance</span>
              </NavLink>

              <NavLink 
                to="/teacher/viewClassAttendance" 
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <ClipboardList className="w-5 h-5" />
                <span className="whitespace-nowrap">View Attendance</span>
              </NavLink>

              <NavLink 
                to="/teacher/marks" 
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <LineChart className="w-5 h-5" />
                <span className="whitespace-nowrap">Marks</span>
              </NavLink>

              <NavLink 
                to="/teacher/lessonPlan" 
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <BookOpen className="w-5 h-5" />
                <span className="whitespace-nowrap">Lesson Plan</span>
              </NavLink>

              <NavLink 
                to="/teacher/studentPerformance" 
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <GraduationCap className="w-5 h-5" />
                <span className="whitespace-nowrap">Student</span>
              </NavLink>
            </div>

            {/* Right side content */}
            <div className="ml-auto flex items-center space-x-6">
              <span className="text-2xl font-bold text-blue-400 animate-pulse">Teacher</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-all duration-200 transform hover:scale-105"
              >
                <LogOut className="w-5 h-5" />
                <span className="whitespace-nowrap">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

// Add these styles to your global CSS or Tailwind config
const styles = `
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.5s ease-out forwards;
}

.delay-200 {
  animation-delay: 200ms;
}

.delay-300 {
  animation-delay: 300ms;
}

.delay-400 {
  animation-delay: 400ms;
}
`;

export default NavBar;