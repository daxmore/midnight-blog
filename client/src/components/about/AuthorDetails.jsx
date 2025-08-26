import React from 'react';
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
                                src="src/assets/images/daxmore.jpg"
                                alt="Dax More"
                                className="relative z-10 w-full h-full object-cover rounded-full border-4 border-gray-700 shadow-2xl"
                            />
                        </div>
                        {/* Author Details */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                    Daksh More
                                </h2>
                                <p className="text-xl text-gray-300 mb-4">Developer and Lead Creator</p>
                            </div>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Just a student who loves turning coffee into code. I'm passionate about building cool stuff for the web and exploring new technologies. This blog is my digital playground where I share what I'm learning.
                            </p>
                            {/* Tech Stack & Expertise */}
                            <div className="bg-gray-800/50 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4 text-white">
                                    Tech Arsenal
                                </h3>
                                <div className="flex flex-wrap gap-3 capitalize">
                                    {[
                                        'React', 'Tailwind', 'Node.js', 'SQLite', 'JavaScript', 'SQL', 'python', 'bootstrap', 'GSAP', 'framer motion', 'mongodb', 'express', 'php', 'sheryjs', 'figma', 'UI/UX', 'canva'
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
                                    year: '2022',
                                    title: 'Started Coding',
                                    description: 'Began my journey into web development, learning the fundamentals of HTML, CSS, and JavaScript.'
                                },
                                {
                                    year: '2023',
                                    title: 'Exploring Libraries',
                                    description: 'Dived deep into the JavaScript ecosystem, experimenting with various libraries and frameworks.'
                                },
                                {
                                    year: '2024',
                                    title: 'Hackathon Experience',
                                    description: 'Participated in a national hackathon, building a cool frontend prototype with a team.'
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
                    
                </div>
            </section>
        </>
    );
};

export default AuthorDetails;