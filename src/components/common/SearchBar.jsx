import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SearchBar = ({
    placeholder = "Search...",
    icon,
    onSearch
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    return (
        <form
            onSubmit={handleSearch}
            className="relative max-w-xl mx-auto"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center bg-gray-700/50 rounded-full p-2 shadow-lg"
            >
                {icon && <div className="ml-3 mr-2">{icon}</div>}
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-white
                    placeholder-gray-400 outline-none focus:outline-none focus:ring-0 
                    border-none px-2"
                />
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-500 
                    text-white rounded-full px-4 py-2 ml-2 
                hover:from-purple-700 hover:to-pink-600 
                transition-all duration-300"
                >
                    Search
                </motion.button>
            </motion.div>
        </form>
    );
};

export default SearchBar;