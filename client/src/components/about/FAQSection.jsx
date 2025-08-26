import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQSection = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const faqs = [
        {
            question: "How can I contribute to Midnight Blog?",
            answer: "I'm always open to collaboration with fellow tech enthusiasts! If you have an interesting project or a guest post idea related to web development or technology, reach out through the contact form. I'm excited to see what we can create together."
        },
        {
            question: "Is it free to read articles on Midnight Blog?",
            answer: "Yes! All articles are completely free. This blog is about sharing knowledge and my learning journey with the community."
        },
        {
            question: "How often do you publish new content?",
            answer: "I try to publish new articles whenever I have something exciting to share, usually a few times a month. It's mostly about my experiences with tech, coding, and student life."
        },
        {
            question: "Can I republish an article from Midnight Blog?",
            answer: "For sure. Just make sure to give credit and link back to the original article. Sharing is caring!"
        },
        {
            question: "How do I get in touch?",
            answer: "You can reach out to me through the contact form on the website. I'm always happy to chat about tech, projects, or anything else!"
        }
    ];

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <section className="text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Got questions? I've got answers. Here are some common inquiries about Midnight Blog.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gray-800/50 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center p-6 text-left 
                hover:bg-gray-700/30 transition duration-300"
                            >
                                <span className="text-xl font-semibold">{faq.question.replace("InkWell", "Midnight Blog")}</span>
                                {openFAQ === index ? (
                                    <ChevronUp className="text-purple-400" />
                                ) : (
                                    <ChevronDown className="text-gray-400" />
                                )}
                            </button>

                            {openFAQ === index && (
                                <div
                                    className="px-6 pb-6 text-gray-300 animate-fade-in-down mt-4"
                                >
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Didn't find what you were looking for?
                        <Link
                            to="/contact"
                            className="ml-2 text-purple-400 hover:underline"
                        >
                            Contact me directly
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;