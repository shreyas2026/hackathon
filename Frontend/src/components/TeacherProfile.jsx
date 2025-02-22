import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, UserCircle, LogOut, BookOpen, Calendar, GraduationCap } from 'lucide-react';

function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/users/getProfile", {
          credentials: 'include',
        });
        const data = await response.json();
        setProfile(data.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/users/logout", {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-lg">
        <h1 className="text-xl font-bold text-gray-700 mb-4">Loading...</h1>
        <p className="text-gray-500 mb-6">Please wait while we load your profile.</p>
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const teacherInfo = [
    { icon: <Mail className="w-5 h-5" />, label: "Email", value: profile.email },
    { icon: <Phone className="w-5 h-5" />, label: "Phone", value: profile.Phone_no },
    { 
      icon: <UserCircle className="w-5 h-5" />, 
      label: "Role", 
      value: "Teacher",
      badge: "bg-green-100 text-green-800"
    },
    { 
      icon: <Calendar className="w-5 h-5" />, 
      label: "Join Date", 
      value: profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : "Not specified"
    },
    { 
      icon: <BookOpen className="w-5 h-5" />, 
      label: "Subjects", 
      value: profile.subjects?.join(", ") || "Not specified"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
          {/* Profile Header */}
          <div className="relative h-32 bg-green-500">
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-green-600">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 pb-8 px-6">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
              {profile.name}
            </h1>

            <div className="space-y-6">
              {teacherInfo.map((info, index) => (
                <div 
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="text-gray-500">{info.icon}</div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500">{info.label}</p>
                    <p className="text-sm text-gray-900">{info.value}</p>
                  </div>
                  {info.badge && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${info.badge}`}>
                      {info.value}
                    </span>
                  )}
                </div>
              ))}

              {profile.bio && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-500 mb-2">About</h3>
                  <p className="text-sm text-gray-900">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;