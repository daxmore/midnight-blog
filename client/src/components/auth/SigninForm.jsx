import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/AuthContext';

const SigninForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:2500/api/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                const data = await response.json();
                console.log('Backend response:', response); // ADDED THIS LINE
                console.log('Backend data:', data); // ADDED THIS LINE

                if (response.ok) {
                    console.log('Signin successful:', data);
                    localStorage.setItem('token', data.token);
                    login(data.token, { username: data.username }); // Use login function from context
                } else {
                    // setSigninError(data.message || 'Signin failed. Please try again.');
                    console.error('Signin failed:', data);
                }
            } catch (error) {
                // setSigninError('Network error. Please try again later.');
                console.error('Error during signin:', error);
            }
        }
    };

    return (
        <AuthLayout type="login">
            <div className="flex flex-col justify-center h-screen">
                <h1 className="text-4xl font-bold mb-8 text-center capitalize"> Log in to your account </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email address"
                                className={`w-full pl-10 p-3 bg-gray-700 text-white rounded-lg 
                focus:outline-none focus:ring-2 
                ${errors.email ? 'border-red-500' : 'border-transparent'}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className={`w-full pl-10 p-3 bg-gray-700 text-white rounded-lg 
                focus:outline-none focus:ring-2 
                ${errors.password ? 'border-red-500' : 'border-transparent'}`}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-300">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <Link
                                to="/forgot-password"
                                className="font-medium text-purple-400 hover:text-purple-300"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 
            text-white py-3 rounded-lg 
            hover:from-purple-700 hover:to-pink-600 
            transition duration-300"
                    >
                        <Link to="/signup" className="font-semibold">Sign In</Link>
                    </motion.button>

                    {/* Toggle to Signup */}
                    <div className="text-center mt-4">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-purple-400 hover:text-purple-300 font-semibold"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default SigninForm;
