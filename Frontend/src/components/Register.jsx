import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import axios from 'axios';

const baseurl = import.meta.env.VITE_BASE_URL;

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Teacher");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getUserProfile = async () => {
        try {
            const response = await axios.get(`${baseurl}/users/getProfile`, {             
                withCredentials: true,
                headers: {
                    "Content-Type": 'application/json'
                },
            });
            
            console.log("Profile data:", response.data);
            const userRole = response.data.data.user.role;
            
            // Redirect based on role
            if (userRole === "Headmaster") {
                navigate("/hm");
            } else if (userRole === "Teacher") {
                navigate("/teacher");
            }
            
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setMessage({ 
                type: "error", 
                text: "Failed to fetch user profile" 
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
    
        const userData = {
            name: username,
            email,
            Phone_no: phone,
            password,
            role
        };
    
        try {
            const response = await axios.post(
                `${baseurl}/users/register`, 
                userData,
                { 
                    withCredentials: true,
                    headers: {
                        "Content-Type": 'application/json'
                    },
                }
            );
    
            if (response.status === 200 || response.status === 201) {
                setMessage({ type: "success", text: "Registration successful! Redirecting..." });
                console.log("Registration successful:", response.data);
                
                // Get user profile and handle navigation
                await getUserProfile();
            }
        } catch (error) {
            console.error("Registration error:", error);
            setMessage({ 
                type: "error", 
                text: error.response?.data?.message || "Registration failed. Please try again." 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16 px-6 flex items-center justify-center">
            <div className="w-full max-w-lg">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-10 space-y-8">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                            <UserPlus className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="mt-6 text-4xl font-bold text-gray-900">Create Account</h2>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-center ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form fields remain the same */}
                        <div>
                            <label className="block text-base font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-base font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={role === "Headmaster"}
                                onChange={(e) => setRole(e.target.checked ? "Headmaster" : "Teacher")}
                                className="w-5 h-5"
                            />
                            <label className="text-base font-medium text-gray-700">Register as Headmaster</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="space-y-6">
                        <div className="text-center">
                            <span className="text-base text-gray-600">Already have an account?</span>
                        </div>
                        <div className='flex justify-center'>
                            <button onClick={() => navigate("/")} className="flex items-center justify-center py-4 px-10 rounded-lg text-base font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all">
                                <LogIn className="h-5 w-5 mr-2" />
                                Log in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;