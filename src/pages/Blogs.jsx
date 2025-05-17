import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BlogCard from '../components/blog/BlogCard';
import BlogHero from '../components/blog/BlogHero';
import { useBlog } from '../context/BlogContext'; // Use the custom hook

const Blogs = () => {
    const { blogs } = useBlog(); // Get blogs from context
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 6;

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, searchTerm]);

    // Handle category change from BlogHero
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    // Handle search from BlogHero
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Filter posts based on active category and search term
    const filteredPosts = blogs.filter(post => {
        // Filter by category
        const categoryMatch = activeCategory === 'All' || post.category === activeCategory;
        
        // Filter by search term
        const searchMatch = !searchTerm || 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return categoryMatch && searchMatch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    // Pagination navigation handler
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top when changing pages
        window.scrollTo({
            top: document.getElementById('blog-results')?.offsetTop - 100 || 0,
            behavior: 'smooth'
        });
    };

    // Generate page numbers
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <motion.button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 mx-1 rounded-lg transition-colors duration-300 ${currentPage === i
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {i}
                </motion.button>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="min-h-screen">
            <BlogHero 
                onCategoryChange={handleCategoryChange} 
                onSearch={handleSearch} 
            />

            <main className="max-w-7xl mx-auto px-4 py-8" id="blog-results">
                <section className="mb-16">
                    <motion.div className="flex justify-between items-center mb-6">
                        <motion.h2
                            className="text-2xl font-bold text-white"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {activeCategory === 'All' ? 'Latest Articles' : `${activeCategory} Articles`}
                        </motion.h2>

                        {searchTerm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-400"
                            >
                                Search results for: <span className="text-blue-400">"{searchTerm}"</span>
                                <button 
                                    className="ml-2 text-sm text-gray-500 hover:text-white"
                                    onClick={() => setSearchTerm('')}
                                >
                                    (clear)
                                </button>
                            </motion.div>
                        )}
                    </motion.div>

                    {filteredPosts.length > 0 ? (
                        <>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {paginatedPosts.map((post, index) => {
                                    // Ensure post has a slug or use ID as fallback
                                    const postWithSlug = {
                                        ...post,
                                        slug: post.slug || post.id.toString()
                                    };
                                    
                                    return (
                                    <div key={postWithSlug.id}>
                                        <BlogCard
                                            id={postWithSlug.id} 
                                            title={postWithSlug.title.length > 30 ? postWithSlug.title.slice(0, 30) + '...' : postWithSlug.title}
                                            category={postWithSlug.category}
                                            excerpt={postWithSlug.content ? 
                                                (postWithSlug.content.length > 120 ? postWithSlug.content.slice(0, 120) + '...' : postWithSlug.content) 
                                                : 'No content available'}
                                            imageUrl={postWithSlug.image}
                                            date={postWithSlug.date}
                                            slug={postWithSlug.slug}
                                            index={index}
                                        />
                                    </div>
                                    );
                                })}
                            </motion.div>

                            {/* Pagination Navigation */}
                            {totalPages > 1 && (
                                <motion.div
                                    className="flex justify-center items-center mt-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {/* Previous Button */}
                                    <motion.button
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className={`mr-4 px-4 py-2 rounded-lg transition-colors duration-300 ${currentPage === 1
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Previous
                                    </motion.button>

                                    {/* Page Numbers */}
                                    {renderPageNumbers()}

                                    {/* Next Button */}
                                    <motion.button
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`ml-4 px-4 py-2 rounded-lg transition-colors duration-300 ${currentPage === totalPages
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next
                                    </motion.button>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <motion.div
                            className="text-center py-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <p className="text-gray-400">
                                {searchTerm 
                                    ? `No articles found matching "${searchTerm}" in ${activeCategory === 'All' ? 'any category' : `the ${activeCategory} category`}.` 
                                    : `No articles found in ${activeCategory === 'All' ? 'any category' : `the ${activeCategory} category`}.`
                                }
                            </p>
                        </motion.div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Blogs;