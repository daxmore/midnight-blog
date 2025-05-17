import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const FAQLink = () => {
    return (
        <div className="py-16">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800/50 rounded-2xl p-12 max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Have More Questions?
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Check out our Frequently Asked Questions page for quick answers to common inquiries.
                    </p>
                    <Link
                        to="/faq"
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 
            text-white font-semibold rounded-lg hover:from-purple-700 
            hover:to-pink-600 transition-all duration-300 transform 
            hover:scale-105 hover:shadow-xl inline-flex items-center"
                    >
                        View FAQ <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQLink;
