// src/components/LoginCTA.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginCTA = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-white py-24 px-6 flex flex-col items-center justify-center text-center space-y-6 min-h-4/5"
        >
            <motion.h2
                className="text-4xl md:text-5xl font-extrabold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                Ready to explore the next big thing?
            </motion.h2>

            <motion.p
                className="text-lg md:text-xl max-w-2xl text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
            >
                Join us today and unlock powerful tools designed to boost your productivity and workflow.
            </motion.p>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <Link
                    to="/signin"
                    target='_blank'
                    className="inline-flex items-center px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200"
                >
                    <LogIn className="w-5 h-5 mr-2" />
                    Login Now
                </Link>
            </motion.div>
        </motion.section>
    );
};

export default LoginCTA;
