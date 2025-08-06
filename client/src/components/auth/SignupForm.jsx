// src/components/auth/SigninForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    AtSymbolIcon,
    LockClosedIcon,
    UserIcon
} from '@heroicons/react/24/solid';
import {
    faGoogle,
    faGithub,
    faFacebook
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthLayout from './AuthLayout';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [signupError, setSignupError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignupError(''); // Clear previous errors
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:2500/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Signup successful:', data);
                    // Optionally, store token and redirect
                    localStorage.setItem('token', data.token);
                    navigate('/signin'); // Redirect to signin page after successful signup
                } else {
                    setSignupError(data.message || 'Signup failed. Please try again.');
                    console.error('Signup failed:', data);
                }
            } catch (error) {
                setSignupError('Network error. Please try again later.');
                console.error('Error during signup:', error);
            }
        }
    };

    

    return (
        <AuthLayout type="signup">
            <>
                <div className="flex flex-col justify-center h-screen">
                    <h1 className="text-4xl font-bold mb-8 text-center capitalize"> sign up to your account </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {signupError && (
                            <p className="text-red-500 text-center text-sm mt-1">{signupError}</p>
                        )}
                        {/* Username Input */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className={`w-full pl-10 p-3 bg-gray-700 text-white rounded-lg 
                focus:outline-none focus:ring-2 
                ${errors.username ? 'border-red-500' : 'border-transparent'}`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                            )}
                        </div>

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

                        {/* Confirm Password Input */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className={`w-full pl-10 p-3 bg-gray-700 text-white rounded-lg 
                focus:outline-none focus:ring-2 
                ${errors.confirmPassword ? 'border-red-500' : 'border-transparent'}`}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms Acceptance */}
                        <div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="acceptTerms"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-300">
                                    I accept the{' '}
                                    <Link
                                        to="/terms"
                                        className="text-purple-400 hover:text-purple-300 underline"
                                    >
                                        Terms and Conditions
                                    </Link>
                                </label>
                            </div>
                            {errors.acceptTerms && (
                                <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>
                            )}
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
                            Create Account
                        </motion.button>

                        

                        {/* Toggle to signup */}
                        <div className="text-center mt-4">
                            <p className="text-gray-400">
                                Already have an account?{' '}
                                <Link
                                    to="/signin"
                                    className="text-purple-400 hover:text-purple-300 font-semibold"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </>
        </AuthLayout>
    );
};

export default SignupForm;