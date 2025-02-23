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
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
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
    
            // Axios automatically parses JSON, so no need for response.json()
            if (response.status === 200 || response.status === 201) {
                setMessage({ type: "success", text: response.data.message });
                setTimeout(() => navigate("/"), 1500);
            } else {
                setMessage({ 
                    type: "error", 
                    text: response.data.message || "Failed to register." 
                });
            }
        } catch (error) {
            setMessage({ 
                type: "error", 
                text: error.response?.data?.message || "Network error. Please try again." 
            });
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
                        {/* Username */}
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

                        {/* Email */}
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

                        {/* Phone */}
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

                        {/* Password */}
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

                        {/* Role Selection */}
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={role === "Headmaster"}
                                onChange={(e) => setRole(e.target.checked ? "Headmaster" : "Teacher")}
                                className="w-5 h-5"
                            />
                            <label className="text-base font-medium text-gray-700">Register as Headmaster</label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition"
                        >
                            Create Account
                        </button>
                    </form>
                                        <div className="space-y-6">
                                            <div className="text-center">
                                                <span className="text-base text-gray-600">Already have an account?</span>
                                            </div>
                                            <div className='flex justify-center'>
                                                <button onClick={()=>{navigate("/")}} className="flex items-center justify-center py-4 px-10 rounded-lg text-base font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all">
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
