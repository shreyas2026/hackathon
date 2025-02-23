import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./TimeTable.css";

const baseurl = import.meta.env.VITE_BASE_URL;

const HMManageTimeTable = () => {
  const [groupedTimetable, setGroupedTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [absentTeachers, setAbsentTeachers] = useState(new Set());
  const [substitutions, setSubstitutions] = useState({});
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [availableSubstitutes, setavailableSubstitutes] = useState([]);
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await fetch(`${baseurl}/timetable/getTimetable`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Unexpected timetable data format:", data);
          setError("Invalid data format received from server");
          setLoading(false);
          return;
        }

        const groupedData = {};
        data.forEach((entry) => {
          const { className, day, periods } = entry;
          if (!groupedData[className]) {
            groupedData[className] = {};
          }
          groupedData[className][day] = periods;
        });

        Object.keys(groupedData).forEach(className => {
          if (!groupedData[className]["Saturday"]) {
            groupedData[className]["Saturday"] = periods.map(periodNumber => ({
              periodNumber,
              subject: periodNumber % 2 === 0 ? "Sports" : "Rotational Activities",
              teacher: { name: "Coach Team" }
            }));
          }
        });

        setGroupedTimetable(groupedData);
        setActiveTab(Object.keys(groupedData)[0] || null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching timetable:", err);
        setError("Failed to load timetable data");
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = [1, 2, 3, 4, 5, 6];

  // const availableSubstitutes = [
  //   "Mr. Smith (Math)",
  //   "Ms. Johnson (Science)",
  //   "Mrs. Davis (English)",
  //   "Mr. Wilson (History)",
  //   "Ms. Brown (Geography)"
  // ];
  useEffect(() => {
    fetchFacultyData();
    // fetchAttendanceStats();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const response = await axios.get(`${baseurl}/teachers/getfaculty`);
      // Store complete faculty data
      setavailableSubstitutes(response.data.faculty);
      // Get unique faculty names
      const uniqueFaculties = [...new Set(response.data.faculty.map(faculty => faculty.name))];
      setavailableSubstitutes(uniqueFaculties);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
      setFacultyData([]);
      setFaculties([]);
    }
  };

  // const fetchAttendanceStats = async () => {
  //   try {
  //     const { data } = await axios.get("http://localhost:8080/api/v1/teachers/getAllFacultyAttendance");
  //     const statsMap = {};
  //     data.stats.forEach(stat => {
  //       statsMap[stat.facultyId] = stat;
  //     });
  //     setAttendanceStats(statsMap);
  //   } catch (error) {
  //     console.error("Error fetching attendance stats:", error);
  //     setAttendanceStats({});
  //   }
  // };
  const getSubjectColor = (subject, day) => {
    if (day === "Saturday") return "#f8d7da";
    
    const colorMap = {
      "Mathematics": "#d1ecf1",
      "Science": "#d4edda",
      "English": "#fff3cd",
      "History": "#f8d7da",
      "Geography": "#e2e3e5",
      "Computer": "#cce5ff",
      "Art": "#f5c6cb",
      "Music": "#c3e6cb",
      "Physical Education": "#ffeeba",
    };
    
    return colorMap[subject] || "#f8f9fa";
  };

  const handleTeacherClick = (teacher, day, period) => {
    if (day === "Saturday") return; // Don't allow substitutions for Saturday activities
    
    setSelectedCell({ teacher, day, period });
    setShowSubModal(true);
  };

  const handleSubstitution = (substituteTeacher) => {
    if (!selectedCell) return;
    
    const { teacher, day, period } = selectedCell;
    const key = `${day}-${period}-${teacher.name}`;
    
    setAbsentTeachers(prev => {
      const newSet = new Set(prev);
      newSet.add(teacher.name);
      return newSet;
    });
    
    setSubstitutions(prev => ({
      ...prev,
      [key]: substituteTeacher
    }));
    
    setShowSubModal(false);
    setSelectedCell(null);
  };

  const SubstitutionModal = () => (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-lg font-bold mb-4">Select Substitute Teacher</h3>
        <div className="space-y-2">
          {availableSubstitutes.map(substitute => (
            <button
              key={substitute}
              onClick={() => handleSubstitution(substitute)}
              className="w-full p-2 text-left hover:bg-gray-100 rounded"
            >
              {substitute}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setShowSubModal(false)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="timetable-management-container">
      <motion.div 
        className="timetable-header"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <h1>School Timetable Management</h1>
        <p>View and manage class schedules</p>
      </motion.div>

      {loading && (
        <motion.div 
          className="loading-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="loading-spinner"></div>
          <p>Loading timetables...</p>
        </motion.div>
      )}
      
      {error && (
        <motion.div 
          className="error-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
        </motion.div>
      )}

      {!loading && !error && (
        <motion.div 
          className="timetable-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="class-tabs" variants={itemVariants}>
            {Object.keys(groupedTimetable).map((className) => (
              <motion.button
                key={className}
                className={`tab-button ${activeTab === className ? 'active' : ''}`}
                onClick={() => setActiveTab(className)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Class {className}
              </motion.button>
            ))}
          </motion.div>

          {activeTab && (
            <motion.div 
              className="active-timetable"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Class {activeTab} Weekly Schedule</h2>
              <div className="timetable-wrapper">
                <table className="timetable">
                  <thead>
                    <tr>
                      <th className="corner-header">Period</th>
                      {days.map((day) => (
                        <th 
                          key={day} 
                          className={`day-header ${day === "Saturday" ? "saturday-header" : ""}`}
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((period) => (
                      <tr key={period}>
                        <td className="period-number">Period {period}</td>
                        {days.map((day) => {
                          const periodData = groupedTimetable[activeTab][day]?.find(
                            (p) => p.periodNumber === period
                          );
                          const isSpecialDay = day === "Saturday";
                          const key = periodData ? `${day}-${period}-${periodData.teacher.name}` : null;
                          const substitute = key ? substitutions[key] : null;
                          
                          return (
                            <motion.td
                              key={`${activeTab}-${day}-${period}`}
                              className={`timetable-cell ${isSpecialDay ? "saturday-cell" : ""} ${substitute ? "substitute-cell" : ""}`}
                              style={{ 
                                backgroundColor: getSubjectColor(periodData?.subject, day),
                                cursor: isSpecialDay ? "default" : "pointer"
                              }}
                              whileHover={{ 
                                scale: 1.05, 
                                boxShadow: "0 5px 15px rgba(0,0,0,0.1)" 
                              }}
                              transition={{ duration: 0.2 }}
                              onClick={() => periodData && handleTeacherClick(periodData.teacher, day, period)}
                            >
                              {periodData ? (
                                <div className="cell-content">
                                  <div className="subject">{periodData.subject}</div>
                                  <div className="teacher-name">
                                    {substitute ? (
                                      <span className="substitute-teacher">{substitute}</span>
                                    ) : (
                                      <span className={absentTeachers.has(periodData.teacher.name) ? "absent-teacher" : ""}>
                                        {periodData.teacher.name}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="free-text">Free Period</div>
                              )}
                            </motion.td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      
      {showSubModal && <SubstitutionModal />}
    </div>
  );
};

export default HMManageTimeTable;