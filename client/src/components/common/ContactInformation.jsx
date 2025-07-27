import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faMapPin,
    faPhone
} from '@fortawesome/free-solid-svg-icons';
import {
    faTwitter,
    faLinkedin,
    faGithub
} from '@fortawesome/free-brands-svg-icons';

const ContactInformation = () => {
    const socialLinks = [
        {
            icon: faTwitter,
            href: '#',
            color: 'text-blue-400'
        },
        {
            icon: faLinkedin,
            href: 'https://www.linkedin.com/in/daksh-more-262215364/',
            color: 'text-blue-600'
        },
        {
            icon: faGithub,
            href: 'https://github.com/daxmore',
            color: 'text-gray-200'
        }
    ];

    return (
        <div className="py-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="bg-gray-800/50 rounded-2xl shadow-2xl p-10 grid md:grid-cols-2 gap-10"
                >
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            Contact Information
                        </h2>
                        <div className="space-y-6 text-gray-300">
                            <div className="flex items-center space-x-4">
                                <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-purple-400" />
                                <a href="mailto:contact@yourblog.com">contact@yourblog.com</a>
                            </div>
                            <div className="flex items-center space-x-4">
                                <FontAwesomeIcon icon={faPhone} className="h-6 w-6 text-green-400" />
                                <a href="tel:+11234567890">+1 (123) 456-7890</a>
                            </div>
                            <div className="flex items-center space-x-4">
                                <FontAwesomeIcon icon={faMapPin} className="h-6 w-6 text-red-400" />
                                <span>123 Tech Lane, Innovation City</span>
                            </div>
                        </div>
                        <div className="mt-8 flex space-x-6">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2 }}
                                    className={`${social.color} text-3xl hover:opacity-80 transition`}
                                >
                                    <FontAwesomeIcon icon={social.icon} className="h-8 w-8" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactInformation;