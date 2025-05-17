import React from 'react';
import { motion } from 'framer-motion';

const ContactHero = () => {
    return (
        <div className="py-20">
            <div className="container mx-auto px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                >
                    Get in Touch
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="text-xl text-gray-300 max-w-2xl mx-auto"
                >
                    We're here to help and answer any question you might have. We look forward to hearing from you!
                </motion.p>
            </div>
        </div>
    );
};

export default ContactHero;
