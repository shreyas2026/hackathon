import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { X, Calendar, BookOpen, ChevronDown } from 'lucide-react';

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
  const [selectedExamType, setSelectedExamType] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const examTypes = ['All', 'Unit Test', 'Mid Term', 'Final Term'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'];

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
      const marksResponse = await fetch(`http://localhost:8080/api/v1/students/getExistingMarksByStudentId/${studentId}`);
      if (marksResponse.ok) {
        const marksData = await marksResponse.json();
        setStudentMarks(marksData);
      }

      // Fetch attendance
      const attendanceResponse = await fetch(`http://localhost:8080/api/v1/students/getStudentAttendanceByStudentId/${studentId}`);
      if (attendanceResponse.ok) {
        const attendanceData = await attendanceResponse.json();
        setStudentAttendance(attendanceData);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  // New data transformation functions
  const getMonthlyAttendance = (month) => {
    return studentAttendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === month;
    });
  };

  const getExamTypeMarks = (examType) => {
    if (examType === 'All') return studentMarks;
    return studentMarks.filter(mark => mark.examType === examType);
  };

  const calculateSubjectAverages = (marks) => {
    const subjectMap = new Map();
    marks.forEach(mark => {
      if (!subjectMap.has(mark.subjectName)) {
        subjectMap.set(mark.subjectName, { total: 0, count: 0 });
      }
      const current = subjectMap.get(mark.subjectName);
      subjectMap.set(mark.subjectName, {
        total: current.total + mark.marks,
        count: current.count + 1
      });
    });

    return Array.from(subjectMap).map(([subject, data]) => ({
      subject,
      average: data.total / data.count
    }));
  };

  const calculateAttendanceStats = (attendance) => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'true').length;
    return [
      { name: 'Present', value: present },
      { name: 'Absent', value: total - present }
    ];
  };

    const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    await fetchStudentDetails(student._id);
    setShowModal(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
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

      {/* Enhanced Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Student Profile: {selectedStudent.name}
              </h3>
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
                  <p><span className="font-medium">DOB:</span> {new Date(selectedStudent.dob).toLocaleDateString()}</p>
                  <p><span className="font-medium">Address:</span> {selectedStudent.address}</p>
                </div>
              </div>

              {/* Monthly Attendance Overview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Monthly Attendance</h4>
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="border rounded-md p-1"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calculateAttendanceStats(getMonthlyAttendance(selectedMonth))}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {calculateAttendanceStats(getMonthlyAttendance(selectedMonth)).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Academic Performance */}
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Academic Performance</h4>
                  <select 
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                    className="border rounded-md p-1"
                  >
                    {examTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getExamTypeMarks(selectedExamType)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subjectName" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="marks" fill="#3b82f6" name="Marks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Average Score</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {(studentMarks.reduce((acc, curr) => acc + curr.marks, 0) / studentMarks.length || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Highest Score</p>
                    <p className="text-2xl font-bold text-green-700">
                      {Math.max(...studentMarks.map(m => m.marks), 0)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject-wise Performance */}
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <h4 className="font-semibold mb-4">Subject-wise Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {calculateSubjectAverages(studentMarks).map((subject, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow">
                      <h5 className="font-medium text-gray-700 mb-2">{subject.subject}</h5>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-indigo-600">
                          {subject.average.toFixed(1)}%
                        </span>
                        <span className="text-sm text-gray-500">average</span>
                      </div>
                    </div>
                  ))}
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