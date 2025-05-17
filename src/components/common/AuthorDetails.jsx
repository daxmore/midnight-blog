import React from 'react';
// Import correct Heroicons or use Lucide React which is already available
import { Github, Linkedin, Twitter } from "lucide-react";

const AuthorDetails = () => {
    return (
        <>
            <section className="text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Author Showcase */}
                    <div className="grid md:grid-cols-3 gap-12 items-center">
                        {/* Author Image with Glowing Effect */}
                        <div className="relative mx-auto md:mx-0 w-64 h-64">
                            <div className="absolute inset-0 bg-purple-500 rounded-full opacity-50 blur-3xl animate-pulse"></div>
                            <img
                                src="src\assets\images\daxmore.jpg"
                                alt="Dax More"
                                className="relative z-10 w-full h-full object-cover rounded-full border-4 border-gray-700 shadow-2xl"
                            />
                        </div>
                        {/* Author Details */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                    Dax More
                                </h2>
                                <p className="text-xl text-gray-300 mb-4">Founder & Lead Creator</p>
                            </div>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Digital alchemist transforming lines of code into meaningful experiences.
                                With a passion for innovation and a caffeine-powered workflow, I navigate
                                the intricate landscapes of technology and creativity.
                            </p>
                            {/* Tech Stack & Expertise */}
                            <div className="bg-gray-800/50 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4 text-white">
                                    Tech Arsenal
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        'React', 'Tailwind', 'Node.js',
                                        'SQLite', 'JavaScript', 'Docker'
                                    ].map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 bg-gray-700 rounded-full text-sm font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Achievements & Journey Timeline */}
                    <div className="mt-16 bg-gray-800/30 rounded-xl p-8">
                        <h3 className="text-2xl font-bold mb-6 text-white">
                            Journey Highlights
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    year: '2018',
                                    title: 'First Startup',
                                    description: 'Founded my first tech startup, focusing on innovative web solutions.'
                                },
                                {
                                    year: '2020',
                                    title: 'Open Source Contributor',
                                    description: 'Became an active contributor to major open-source projects.'
                                },
                                {
                                    year: '2022',
                                    title: 'Tech Mentor',
                                    description: 'Started mentoring aspiring developers and sharing knowledge.'
                                }
                            ].map((milestone) => (
                                <div key={milestone.year} className="bg-gray-900 p-6 rounded-lg">
                                    <div className="text-3xl font-bold text-purple-500 mb-2">
                                        {milestone.year}
                                    </div>
                                    <h4 className="text-xl font-semibold mb-3 text-white">
                                        {milestone.title}
                                    </h4>
                                    <p className="text-gray-400">
                                        {milestone.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Social & Contact */}
                    <div className="mt-12 flex justify-center space-x-6">
                        <a
                            href="https://github.com/daxmore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white hover:scale-110 transition-transform"
                        >
                            <Github className="h-9 w-9" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/daksh-more-262215364/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white hover:scale-110 transition-transform"
                        >
                            <Linkedin className="h-9 w-9" />
                        </a>
                        <a
                            href="https://x.com/"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white hover:scale-110 transition-transform"
                        >
                            <Twitter className="h-9 w-9" />
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AuthorDetails;