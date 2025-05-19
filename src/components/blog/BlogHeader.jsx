import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiUser } from 'react-icons/fi';

const BlogHeader = ({ title, featuredImage, author, date, readTime }) => {
    // Ensure we have valid data for all fields
    const safeTitle = title || 'Untitled Blog Post';
    const safeAuthor = typeof author === 'object' ? author : { name: author || 'Anonymous' };
    const safeDate = date || 'No date';
    const safeReadTime = readTime || '5 min read';
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
        >
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">
                {safeTitle}
            </h1>

            <div className="flex justify-center items-center space-x-4 text-gray-400 mb-6">
                <div className="flex items-center space-x-2">
                    <FiUser className="text-lg" />
                    <span>{safeAuthor.name}</span>
                </div>
                <span>•</span>
                <div className="flex items-center justify-center text-sm space-x-2">
                    <FiClock className="text-lg" />
                    <span>{safeDate} • {safeReadTime}</span>
                </div>
            </div>

            {featuredImage && (
                <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    src={featuredImage}
                    alt={safeTitle}
                    className="w-full max-h-[500px] object-cover rounded-lg shadow-lg mx-auto"
                />
            )}
        </motion.div>
    );
};

export default BlogHeader;
