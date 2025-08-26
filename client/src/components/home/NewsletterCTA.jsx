import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';

const NewsletterCTA = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement newsletter signup logic
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-8 rounded-lg mt-16 text-center"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
        Stay Updated with Midnight Blog
      </h2>
      <p className="text-white/80 mb-6 text-sm sm:text-base">
        Get the latest articles, insights, and exclusive content delivered straight to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-white/20 text-white placeholder-white/60 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
        >
          <FaPaperPlane className="text-lg" />
        </button>
      </form>
    </motion.div>
  );
};

export default NewsletterCTA;
