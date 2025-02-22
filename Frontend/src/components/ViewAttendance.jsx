import React, { useState, useEffect } from "react";
import { 
  Users, 
  Calendar as CalendarIcon, 
  Loader2,
  ArrowLeft,
  Search,
  CheckCircle,
  XCircle,
  UserCheck,
  UsersIcon
} from "lucide-react";

const ViewAttendance = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const classes = [
    { id: "1", name: "10A" },
    { id: "2", name: "10B" },
    { id: "3", name: "10C" },
    { id: "4", name: "9A" },
    { id: "5", name: "9B" },
    { id: "6", name: "9C" },
  ];

  const fetchAttendance = async () => {
    if (!selectedClass) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:8080/api/v1/students/getAttendanceByClass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: selectedClass,
          date: selectedDate.toISOString().split('T')[0]
        })
      });
      
      const data = await response.json();
      
      if (data.students) {
        setStudents(data.students);
      } else {
        setError("No attendance records found");
      }
    } catch (error) {
      setError("Failed to fetch attendance. Please try again.");
      console.error("Error fetching attendance:", error);
    }
    
    setIsLoading(false);
  };

  // Calculate attendance statistics
  const totalStudents = students.length;
  const presentStudents = students.filter(student => student.attendanceStatus === "true").length;
  const attendancePercentage = totalStudents > 0 
    ? Math.round((presentStudents / totalStudents) * 100) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">View Attendance</h1>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              className="flex-1 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSelectedClass(e.target.value)}
              value={selectedClass}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button 
              onClick={fetchAttendance}
              disabled={!selectedClass || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  View
                </>
              )}
            </button>
          </div>

          {students.length > 0 && (
            <>
              {/* Attendance Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-70 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Students</p>
                    <p className="text-2xl font-bold text-blue-700">{totalStudents}</p>
                  </div>
                  <UsersIcon className="w-8 h-8 text-blue-500" />
                </div>

                <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Present Students</p>
                    <p className="text-2xl font-bold text-green-700">{presentStudents}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-500" />
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">Roll No: {student.roll_no}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                      student.attendanceStatus === "true" 
                        ? "bg-green-100 text-green-700" 
                        : student.attendanceStatus === "false"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {student.attendanceStatus === "true" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : student.attendanceStatus === "false" ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        "-"
                      )}
                      <span className="font-medium">
                        {student.attendanceStatus === "true" 
                          ? "Present" 
                          : student.attendanceStatus === "false"
                          ? "Absent"
                          : "Not Recorded"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;