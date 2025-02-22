import React from 'react';
import { NavLink } from "react-router-dom";
import { UserCircle, ClipboardList, BookOpen, LineChart, GraduationCap, Calendar } from 'lucide-react';

function NavBar() {
  const activeClassName = "flex items-center gap-3 text-lg font-medium text-blue-400 bg-gray-800 p-3 rounded-lg transition-all duration-200";
  const inactiveClassName = "flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800 p-3 rounded-lg transition-all duration-200";

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-between w-full space-x-6">
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
                <span className="whitespace-nowrap">Attendance</span>
              </NavLink>

              <NavLink 
                to="/teacher/viewClassAttendance" 
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <ClipboardList className="w-5 h-5" />
                <span className="whitespace-nowrap">view Attendance</span>
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

              <NavLink 
                to="/teacher/upcomingExams" 
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <Calendar className="w-5 h-5" />
                <span className="whitespace-nowrap">Upcoming Exams</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
