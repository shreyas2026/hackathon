import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, UserCircle, Building } from 'lucide-react';

const baseurl = import.meta.env.VITE_BASE_URL;

function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${baseurl}/users/getProfile`, {
          credentials: 'include',
        });

        if (response.status === 401) {
          setError("You are not authorized. Please log in.");
          return;
        }

        const data = await response.json();
        setProfile(data.data.user);
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${baseurl}/users/logout`, {
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg text-center">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-45 bg-gradient-to-r from-blue-600 to-blue-400">
            <div className="pt-7 pl-7">
              <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-blue-600">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 pb-8 px-8">
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-gray-500 mt-1">Teacher ID: {profile.id || 'N/A'}</p>

            <div className="grid gap-6 mt-6">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-blue-600" />
                <p className="ml-4">{profile.email}</p>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-blue-600" />
                <p className="ml-4">{profile.Phone_no}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
