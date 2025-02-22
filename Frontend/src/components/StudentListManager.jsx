import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';

const StudentListManager = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentMarks, setStudentMarks] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Generate class options
  const classOptions = Array.from({ length: 20 }, (_, i) => {
    const grade = Math.floor(i / 2) + 1;
    const section = i % 2 === 0 ? 'A' : 'B';
    const value = `${grade}${section}`;
    return { value, label: `Class ${value}` };
  });

  const fetchStudentsByClass = async (selectedClass) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/api/v1/students/getStudentListByClass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ class: selectedClass }),
      });

      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data.studentList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      // Fetch marks
      const marksResponse = await fetch(`http://localhost:8080/api/v1/students/getExistingMarksByStudentId/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        }
      });
      console.log(marksResponse);
      if (marksResponse.ok) {
        const marksData = await marksResponse.json();
        setStudentMarks(marksData);
      }

      // Fetch attendance
      const attendanceResponse = await fetch(`http://localhost:8080/api/v1/students/getStudentAttendanceByStudentId/${studentId}`);
      console.log(attendanceResponse);
      if (attendanceResponse.ok) {
        const attendanceData = await attendanceResponse.json();
        setStudentAttendance(attendanceData);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    await fetchStudentDetails(student._id);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Prepare data for charts
  const prepareMarksData = () => {
    if (!studentMarks.length) return [];
    return studentMarks.map(mark => ({
      subject: mark.subjectName,
      marks: mark.marks,
      examType: mark.examType
    }));
  };

  const calculateAttendancePercentage = () => {
    if (!studentAttendance.length) return 0;
    // Still using raw attendance data for calculation
    const present = studentAttendance.filter(a => a.status === 'true').length;
    return (present / studentAttendance.length) * 100;
  };

  // Transform attendance data for the chart visualization
  const transformAttendanceData = (data) => {
    return data.map(record => ({
      date: record.date,
      // Convert 'true'/'false' string to 1/0 for better visualization
      status: record.status === 'true' ? 1 : 0,
      // Add a label for tooltip
      statusLabel: record.status === 'true' ? 'Present' : 'Absent'
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Student List Manager</h2>
      </div>
      
      <div className="space-y-6">
        {/* Class Dropdown */}
        <div className="relative w-64">
          <button
            className="w-full px-4 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedClass ? `Class ${selectedClass}` : "Select a class"}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-auto">
              {classOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    setSelectedClass(option.value);
                    fetchStudentsByClass(option.value);
                    setIsDropdownOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading and Error States */}
        {loading && <div className="text-center py-4 text-gray-600">Loading students...</div>}
        {error && <div className="text-red-500 py-2">{error}</div>}

        {/* Students Table */}
        {!loading && !error && students.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left border border-gray-200 font-semibold text-gray-700">Name</th>
                  <th className="p-3 text-left border border-gray-200 font-semibold text-gray-700">Roll Number</th>
                  <th className="p-3 text-left border border-gray-200 font-semibold text-gray-700">Email</th>
                  <th className="p-3 text-left border border-gray-200 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="p-3 border border-gray-200">{student.name}</td>
                    <td className="p-3 border border-gray-200">{student.roll_no}</td>
                    <td className="p-3 border border-gray-200">{student.email}</td>
                    <td className="p-3 border border-gray-200">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        onClick={() => handleStudentSelect(student)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && students.length === 0 && selectedClass && (
          <div className="text-center py-4 text-gray-600">
            No students found in this class.
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Student Details</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-4">Personal Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedStudent.name}</p>
                  <p><span className="font-medium">Roll No:</span> {selectedStudent.roll_no}</p>
                  <p><span className="font-medium">Email:</span> {selectedStudent.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedStudent.phone_no}</p>
                  <p><span className="font-medium">DOB:</span> {formatDate(selectedStudent.dob)}</p>
                  <p><span className="font-medium">Address:</span> {selectedStudent.address}</p>
                </div>
              </div>

              {/* Academic Performance */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-4">Academic Performance</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareMarksData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="marks" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Attendance Chart */}
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <h4 className="font-semibold mb-4">Attendance Overview</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transformAttendanceData(studentAttendance)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} />
                      <YAxis domain={[0, 1]} ticks={[0, 1]} /> {/* Only show 0 and 1 */}
                      <Tooltip 
                        formatter={(value) => [value === 1 ? 'Present' : 'Absent', 'Status']}
                        labelFormatter={formatDate}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="status"
                        name="Attendance"
                        stroke="#3b82f6" 
                        dot={{ fill: '#3b82f6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-lg">
                    Overall Attendance: 
                    <span className="font-bold ml-2">
                      {calculateAttendancePercentage().toFixed(1)}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentListManager;
