import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, formData);

            if (response.status === 201) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', formData.username);
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'An error occurred. Please try again.');
            } else if (error.request) {
                setError('No response from the server. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-purple-400 to-black flex items-center justify-center text-white">
            <div className="bg-purple-950/20 backdrop-blur-xl p-8 rounded-3xl shadow-lg w-full max-w-md border-2 border-purple-200">
                <h1 className="text-3xl font-bold text-purple-200 mb-6">Sign up</h1>
                {error && <p className="text-red-800 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <label htmlFor="username" className="sr-only">Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        id="username"
                        onChange={handleChange}
                        value={formData.username}
                        className="bg-purple-900/50 p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        onChange={handleChange}
                        value={formData.email}
                        className="bg-purple-900/50 p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        onChange={handleChange}
                        value={formData.password}
                        className="bg-purple-900/50 p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        className="bg-purple-900 text-white p-3 rounded-3xl shadow hover:bg-purple-700 transition duration-300"
                    >
                        Sign up
                    </button>
                </form>
                <p className="mt-10">Already have an account? <Link to="/signin" className="text-purple-300 hover:bg-purple-700 bg-purple-500/50 rounded-2xl px-2">Sign in</Link></p>
            </div>
        </div>
    );
}

export default Signup;
