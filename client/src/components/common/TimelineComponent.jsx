import React from 'react';
import { Award, Code, Globe } from 'lucide-react';

const TimelineComponent = () => {
    const milestones = [
        {
            year: 2018,
            title: 'Blog Inception',
            description: 'Founded InkWell as a passion project to share tech insights and creative stories.',
            icon: <Globe className="text-purple-500" />,
            achievements: [
                'First blog post published',
                'Built initial platform infrastructure',
                'Established core vision and mission'
            ]
        },
        {
            year: 2020,
            title: 'Community Growth',
            description: 'Expanded our reach and transformed into a collaborative writing platform.',
            icon: <Code className="text-green-500" />,
            achievements: [
                'Reached 10,000+ monthly readers',
                'Introduced multi-author support',
                'Implemented advanced content management system'
            ]
        },
        {
            year: 2022,
            title: 'Tech Innovation',
            description: 'Revolutionized our platform with cutting-edge technologies and design.',
            icon: <Award className="text-blue-500" />,
            achievements: [
                'Migrated to React and Tailwind CSS',
                'Implemented serverless architecture',
                'Won "Best Tech Blog" community award'
            ]
        }
    ];

    return (
        <section className="text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        InkWell Journey
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Our path of continuous learning, innovation, and community building
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-700 h-full hidden md:block"></div>

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <div
                                key={milestone.year}
                                className={`flex items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                                    }`}
                            >
                                {/* Milestone Content */}
                                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'
                                    }`}>
                                    <div className="bg-gray-800/50 rounded-xl p-6 shadow-lg">
                                        <div className="flex items-center mb-4">
                                            <div className="mr-4">{milestone.icon}</div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">
                                                    {milestone.year}
                                                </h3>
                                                <h4 className="text-xl font-semibold text-gray-200">
                                                    {milestone.title}
                                                </h4>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 mb-4">
                                            {milestone.description}
                                        </p>
                                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                                            {milestone.achievements.map((achievement) => (
                                                <li key={achievement}>{achievement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Milestone Marker (for desktop) */}
                                <div className="hidden md:block w-1/2 relative">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Future Vision */}
                <div className="mt-16 text-center">
                    <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Our Future Vision
                    </h3>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Continuing to evolve, innovate, and create a platform that empowers writers
                        and connects passionate readers with transformative ideas.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TimelineComponent;