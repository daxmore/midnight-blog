import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero = () => {
    // Update document title and meta description for homepage
    useEffect(() => {
        // Set homepage title
        document.title = 'Midnight Blog | Share Your Stories';
        
        // Update meta description for better SEO
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Discover thought-provoking articles or share your own stories with our community at Midnight Blog.');
        }
    }, []);

    return (
        <section className="relative text-white py-36 px-6 overflow-hidden">
            {/* Floating Decorative Elements */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{
                    x: 0,
                    opacity: 0.3,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: "easeInOut"
                }}
                className="absolute top-20 left-10 w-48 h-48 bg-purple-300 rounded-full blur-xl opacity-30"
                aria-hidden="true"
            />
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{
                    x: 0,
                    opacity: 0.3,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: "easeInOut",
                    delay: 0.5
                }}
                className="absolute bottom-20 right-10 w-64 h-64 bg-blue-300 rounded-full blur-xl opacity-30"
                aria-hidden="true"
            />

            {/* Hero Content */}
            <div className="relative max-w-4xl mx-auto text-center z-10">
                <header>
                    <motion.h1
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight mb-6 font-rubik"
                    >
                        Unlock Worlds With Every Word
                    </motion.h1>
                </header>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-lg sm:text-xl text-gray-300 mb-10 font-[poppins]"
                >
                    Explore powerful ideas and deep insights from writers who dare to dream.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link to="/signin">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
                        >
                            Start Writing
                        </motion.button>
                    </Link>
                    <Link to="/blogs">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-b from-gray-800 to-black text-white px-6 py-3 rounded-md hover:bg-white transition-all hover:shadow-xl hover:shadow-gray-500/25"
                        >
                            Explore Posts
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

export default Hero