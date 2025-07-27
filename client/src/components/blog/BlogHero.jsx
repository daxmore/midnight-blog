import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaBook,
    FaSearch,
    FaFilter,
    FaPaperPlane
} from 'react-icons/fa';

const BlogHero = ({ onCategoryChange, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Categories for filtering
    const categories = [
        'All',
        'Technology',
        'Web Development',
        'Design',
        'Machine Learning',
        'Artificial Intelligence'
    ];

    // Update parent component when filters change
    useEffect(() => {
        if (onCategoryChange) {
            onCategoryChange(selectedCategory);
        }
    }, [selectedCategory, onCategoryChange]);

    // Handle search
    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    // Handle category click
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle enter key press in search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Variants for animated elements
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <div className="relative overflow-hidden">
            {/* Floating Decorative Elements */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 0.3 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute top-20 left-10 w-32 h-32 bg-purple-300 rounded-full blur-xl"
            />
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 0.3 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-20 right-10 w-48 h-48 bg-blue-300 rounded-full blur-xl"
            />

            {/* Hero Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container mx-auto px-4 py-16 relative z-10 text-center"
            >
                {/* Title */}
                <motion.h1
                    variants={itemVariants}
                    className="text-5xl font-bold mb-6 flex justify-center items-center"
                >
                    <FaBook className="mr-4 text-blue-500 md:block hidden" />
                    Explore Innovative Ideas
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-xl mb-10 max-w-2xl mx-auto"
                >
                    Dive into a world of cutting-edge insights, thought-provoking articles,
                    and transformative knowledge across various domains.
                </motion.p>

                {/* Search and Filter Section */}
                <motion.div
                    variants={itemVariants}
                    className="max-w-3xl mx-auto flex items-center space-x-4"
                >
                    {/* Search Input */}
                    <div className="flex-grow relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Search articles..."
                            className="w-full p-3 pl-10 rounded-full border text-white border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Category Dropdown */}
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryClick(e.target.value)}
                            className="appearance-none w-full p-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 pr-10"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category} className='text-black'>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Search Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors flex items-center"
                        onClick={handleSearch}
                    >
                        <FaPaperPlane className="mr-2" /> Search
                    </motion.button>
                </motion.div>

                {/* Category Pills */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 flex justify-center flex-wrap gap-4"
                >
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${selectedCategory === category
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }
                `}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </motion.button>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default BlogHero;