import React from 'react';
import { NavLink } from "react-router-dom";
import { UserCircle, ClipboardList, Calendar, FileText } from 'lucide-react';

function HMNavBar() {
  const activeClassName = "flex items-center gap-3 text-lg font-medium text-blue-400 bg-gray-800 p-3 rounded-lg transition-all duration-200";
  const inactiveClassName = "flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 p-3 rounded-lg transition-all duration-200";

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16">
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-6">
              <NavLink 
                to="/hm" 
                end
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <UserCircle className="w-5 h-5" />
                <span>Profile</span>
              </NavLink>

              <NavLink 
                to="/hm/manageTeachers" 
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <ClipboardList className="w-5 h-5" />
                <span>Manage Teachers</span>
              </NavLink>

              <NavLink 
                to="/hm/manageExams" 
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <FileText className="w-5 h-5" />
                <span>Manage Exams</span>
              </NavLink>

              <NavLink 
                to="/hm/manageTimeTable" 
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <Calendar className="w-5 h-5" />
                <span>Manage TimeTable</span>
              </NavLink>

              <NavLink 
                to="/hm/todaysAttendace" 
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <Calendar className="w-5 h-5" />
                <span>Todays Attendance</span>
              </NavLink>
            </div>
            <div className="ml-auto flex items-center">
            <span className="text-2xl font-bold text-blue-400">Headmaster</span>
          </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default HMNavBar;
