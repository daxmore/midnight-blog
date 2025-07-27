import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    HomeIcon
} from '@heroicons/react/24/solid';
import SearchBar from '../components/common/SearchBar';

const ErrorPage = ({
    errorCode = '404',
    errorMessage = 'Page Not Found'
}) => {
    const suggestedLinks = [
        {
            title: 'Home',
            path: '/',
            description: 'Return to the main page'
        },
        {
            title: 'Blogs',
            path: '/blogs',
            description: 'Explore our latest articles'
        },
        {
            title: 'Categories',
            path: '/categories',
            description: 'Browse content by topic'
        },
        {
            title: 'About',
            path: '/about',
            description: 'Learn about InkWell'
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full bg-gray-800/50 rounded-2xl shadow-2xl p-12 text-center"
            >
                {/* Error Code and Icon */}
                <div className="flex items-center justify-center mb-8">
                    <ExclamationTriangleIcon
                        className="h-16 w-16 text-yellow-500 mr-4"
                    />
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        {errorCode}
                    </h1>
                </div>

                {/* Error Message */}
                <h2 className="text-3xl font-bold text-white mb-4">
                    {errorMessage}
                </h2>
                <p className="text-gray-300 mb-8">
                    Oops! The page you're looking for seems to have taken an unexpected detour.
                </p>

                {/* Search Bar */}
                <div className="mb-8">
                    <SearchBar
                        placeholder="Search for content..."
                        icon={<MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />}
                    />
                </div>

                {/* Suggested Links */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {suggestedLinks.map((link, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition"
                        >
                            <Link
                                to={link.path}
                                className="flex items-center text-white hover:text-purple-400"
                            >
                                <span className="font-semibold mr-2">{link.title}</span>
                                <HomeIcon className="h-5 w-5" />
                            </Link>
                            <p className="text-gray-400 text-sm text-left m1-2">{link.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Return Home Button */}
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 
            bg-gradient-to-r from-purple-600 to-pink-500 
            text-white font-semibold rounded-lg 
            hover:from-purple-700 hover:to-pink-600 
            transition-all duration-300"
                    >
                        <HomeIcon className="h-6 w-6 mr-2" />
                        Return Home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ErrorPage;