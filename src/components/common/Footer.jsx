import React from 'react'
import { Link } from 'react-router-dom'
import { Feather, ArrowRight } from 'lucide-react'

const Footer = () => {
    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Blogs', path: '/blogs' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ]

    const socialLinks = [
        {
            name: 'Facebook',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
            ),
            href: '#'
        },
        {
            name: 'Github',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>

            ),
            href: 'https://github.com/daxmore'
        },
        {
            name: 'Instagram',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                </svg>
            ),
            href: '#'
        },
        {
            name: 'LinkedIn',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-6a6 6 0 016-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                </svg>
            ),
            href: 'https://www.linkedin.com/in/daksh-more-262215364/'
        }
    ]

    return (
        <footer className="text-gray-300 py-16">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Brand Section */}
                <div className="space-y-6">
                    <div className="flex items-center">
                        <Feather className="mr-3 text-white" size={32} />
                        <h2 className="text-3xl font-bold text-white">Midnight Blog</h2>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                        Unlock worlds with every word. Explore powerful ideas and deep insights from writers who dare to dream.
                    </p>
                    <div className="flex space-x-4">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                className="text-gray-400 hover:text-white transition-colors duration-300"
                                aria-label={social.name}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-6">Quick Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                <ArrowRight
                                    className="mr-2 w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-6">Stay Updated</h3>
                    <p className="text-gray-400 mb-4">
                        Subscribe to our newsletter for the latest blog posts and updates.
                    </p>
                    <div className="flex">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center">
                <p className="text-gray-500">
                    © {new Date().getFullYear()} Midnight Blog — All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer