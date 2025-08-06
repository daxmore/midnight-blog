import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaGithub, FaLinkedin, FaUser } from 'react-icons/fa';

const AuthorBioCard = ({ author }) => {
    // Create default author if not provided
    const defaultAuthor = {
        name: 'Anonymous Author',
        bio: 'Information about this author is not available.',
        avatar: 'src/assets/images/daxmore.jpg',
        socialLinks: []
    };

    // Use provided author or default if missing
    const authorData = author && typeof author === 'object' ? author : defaultAuthor;
    
    return (
        <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800 p-6 rounded-lg mt-12 flex items-center space-x-6"
        >
            {authorData.avatar ? (
                <img
                    src={authorData.avatar || '/src/assets/images/daxmore.jpg'}
                    alt={authorData.name}
                    className="w-24 h-24 rounded-full object-cover"
                />
            ) : (
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                    <FaUser className="text-gray-400 text-4xl" />
                </div>
            )}
            <div>
                <h3 className="text-2xl font-bold text-white">{authorData.name}</h3>
                <p className="text-gray-400 mb-4">{authorData.bio}</p>
                
            </div>
        </motion.div>
    );
};

export default AuthorBioCard;
