import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQSection = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const faqs = [
        {
            question: "How can I contribute to InkWell?",
            answer: "We welcome writers from all backgrounds! Submit your pitch through our contact form, and our editorial team will review it. We look for original, insightful content that aligns with our mission."
        },
        {
            question: "Is it free to read articles on InkWell?",
            answer: "Yes! All our articles are completely free to read. We believe in open access to knowledge and aim to make our content accessible to everyone."
        },
        {
            question: "How often do you publish new content?",
            answer: "We publish new articles weekly, covering a diverse range of topics from technology and creativity to personal development and innovation."
        },
        {
            question: "Can I republish an article from InkWell?",
            answer: "Most of our articles are published under a Creative Commons license. You can republish with proper attribution and a link back to the original piece."
        },
        {
            question: "How do I subscribe to InkWell?",
            answer: "You can subscribe to our newsletter through the signup form on our homepage. We'll send you weekly updates with our latest articles and exclusive content."
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
                        Got questions? We've got answers. Here are some common inquiries about InkWell.
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
                                <span className="text-xl font-semibold">{faq.question}</span>
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
                            Contact us directly
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
