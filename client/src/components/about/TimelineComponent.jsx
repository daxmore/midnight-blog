import React from 'react';
import { Award, Code, Globe } from 'lucide-react';

const TimelineComponent = () => {
    const milestones = [
        {
            year: 2022,
            title: 'The Spark',
            description: 'Started Midnight Blog as a personal project to document my coding journey and share what I\'ve learned.',
            icon: <Globe className="text-purple-500" />,
            achievements: [
                'Published the first blog post',
                'Set up the basic website',
                'Decided on the blog\'s mission'
            ]
        },
        {
            year: 2023,
            title: 'Gaining Momentum',
            description: 'The blog started to get some attention! Focused on creating better content and building a small community.',
            icon: <Code className="text-green-500" />,
            achievements: [
                'Reached 100+ monthly readers',
                'Added more blog categories',
                'Redesigned the blog layout'
            ]
        },
        {
            year: 2024,
            title: 'Leveling Up',
            description: 'Rebuilt the blog with a modern tech stack to make it faster and more interactive.',
            icon: <Award className="text-blue-500" />,
            achievements: [
                'Migrated to a React-based framework',
                'Implemented a new design with Tailwind CSS',
                'Focused on performance and UX'
            ]
        }
    ];

    return (
        <section className="text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold leading-tight md:leading-20 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Midnight Blog Journey
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        A timeline of how this blog has grown and evolved.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-700 h-full hidden md:block"></div>

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <div
                                key={milestone.year}
                                className={`flex items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}
                                    }`}>
                                {/* Milestone Content */}
                                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}
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
                        What's Next?
                    </h3>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        I'm always learning and experimenting. The journey continues with more projects, tutorials, and thoughts on tech.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TimelineComponent;
