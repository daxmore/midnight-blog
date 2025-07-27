import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const ContactCTA = () => {
    return (
        <section className="text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-800/50 rounded-xl p-10 shadow-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                        {/* CTA Content */}
                        <div className="flex items-center space-x-6">
                            <div className="bg-purple-500/20 p-4 rounded-full hidden md:block">
                                <MessageCircle
                                    className="text-purple-400"
                                    size={48}
                                    strokeWidth={1.5}
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                    Have a Question or Collaboration in Mind?
                                </h2>
                                <p className="text-gray-300 max-w-xl">
                                    We're always excited to hear from our readers, writers, and
                                    potential collaborators. Whether it's feedback, a pitch, or
                                    just saying hello, we're all ears!
                                </p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                            to="/contact"
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 
                text-white font-semibold rounded-lg hover:from-purple-700 
                hover:to-pink-600 transition-all duration-300 transform 
                hover:scale-105 hover:shadow-xl"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactCTA;
