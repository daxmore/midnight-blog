import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic
        console.log(formData);
    };

    return (
        <div className="py-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800/50 rounded-2xl shadow-2xl p-10"
                >
                    <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center">
                        Send Us a Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileFocus={{ scale: 1.02 }}
                            >
                                <label className="block text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileFocus={{ scale: 1.02 }}
                            >
                                <label className="block text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </motion.div>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileFocus={{ scale: 1.01 }}
                        >
                            <label className="block text-gray-300 mb-2">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileFocus={{ scale: 1.01 }}
                        >
                            <label className="block text-gray-300 mb-2">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            ></textarea>
                        </motion.div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-lg hover:from-purple-700 hover:to-pink-600 transition duration-300 flex items-center justify-center"
                        >
                            <PaperAirplaneIcon className="mr-2 h-6 w-6" /> Send Message
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactForm;
