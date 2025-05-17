import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaTwitter, FaFacebook, FaLinkedin,
    FaLink, FaCopy
} from 'react-icons/fa';

const ShareButtons = ({ title, url }) => {
    const [copied, setCopied] = useState(false);
    
    // Ensure we have a valid title and URL
    const safeTitle = title || 'Blog Post';
    const safeUrl = url || window.location.href;

    const shareLinks = [
        {
            Icon: FaTwitter,
            color: 'text-blue-400',
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(safeTitle)}&url=${safeUrl}`
        },
        {
            Icon: FaFacebook,
            color: 'text-blue-600',
            href: `https://www.facebook.com/sharer/sharer.php?u=${safeUrl}`
        },
        {
            Icon: FaLinkedin,
            color: 'text-blue-700',
            href: `https://www.linkedin.com/shareArticle?mini=true&url=${safeUrl}&title=${encodeURIComponent(safeTitle)}`
        }
    ];

    const copyLink = () => {
        navigator.clipboard.writeText(safeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-8"
        >
            {shareLinks.map(({ Icon, color, href }, index) => (
                <motion.a
                    key={index}
                    aria-label="Share on Twitter"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`${color} text-2xl hover:opacity-80 transition-all`}
                >
                    <Icon />
                </motion.a>
            ))}

            <motion.button
                onClick={copyLink}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 text-2xl hover:text-white transition-all"
            >
                {copied ? <FaCopy className="text-green-500" /> : <FaLink />}
            </motion.button>
        </motion.div>
    );
};

export default ShareButtons;
