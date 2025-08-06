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
            <main className="container mx-auto px-4 py-8">
                <section id="blog-results" className="mt-8">
                    {filteredPosts.length > 0 ? (
                        <>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {paginatedPosts.map((post, index) => (
                                    <BlogCard
                                        key={post._id}
                                        id={post._id}
                                        title={post.title}
                                        category={post.category}
                                        excerpt={post.excerpt || post.content}
                                        imageUrl={post.featuredImage}
                                        date={post.createdAt}
                                        slug={post.slug}
                                        index={index}
                                    />
                                ))}
                            </motion.div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <motion.div
                                    className="flex justify-center items-center mt-8 space-x-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {/* Previous Button */}
                                    <motion.button
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                                            currentPage === 1
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
                                        className={`ml-4 px-4 py-2 rounded-lg transition-colors duration-300 ${
                                            currentPage === totalPages
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