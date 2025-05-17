import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMoreVertical } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { BlogContext } from '../../context/BlogContext';

const BlogCard = ({ title, excerpt, imageUrl, date, readTime, category, index, onEdit, onDelete, id, slug }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    //remove blog post it comes from the context
    const { removeBlog } = useContext(BlogContext);

    // Format date for structured data
    const isoDate = new Date(date).toISOString ? new Date(date).toISOString() : '';

    // Clean up excerpt by removing HTML tags before calculating length
    const cleanExcerpt = excerpt ? excerpt.replace(/<[^>]*>?/gm, '') : '';

    return (
        <motion.article
            className="relative bg-gray-800/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            itemScope
            itemType="https://schema.org/BlogPosting"
        >
            {/* Schema.org metadata */}
            <meta itemProp="headline" content={title} />
            <meta itemProp="description" content={cleanExcerpt} />
            <meta itemProp="author" content="Midnight Blog" />
            {isoDate && <meta itemProp="datePublished" content={isoDate} />}
            {category && <meta itemProp="keywords" content={category} />}
            
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-48 object-cover"
                    itemProp="image"
                />
            )}
            <div className="p-6 relative">
                {/* Three-dot menu button */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white hover:text-gray-300 focus:outline-none"
                        aria-label="Options menu"
                    >
                        <FiMoreVertical size={20} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-gray-900 text-white rounded-md shadow-lg z-10">
                            <button
                                className="block rounded-md w-full px-4 py-2 text-left hover:bg-gray-700"
                                onClick={() => {
                                    setMenuOpen(false);
                                    removeBlog(id);
                                    onDelete?.(title);
                                }}
                                aria-label="Delete blog post"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-xs mb-2">
                    {category || 'Uncategorized'}
                </span>
                <h3 className="text-xl font-bold mb-2 text-white" itemProp="name">
                    {title}
                </h3>
                <div
                    className="text-gray-400 mb-4 min-h-[80px]"
                    dangerouslySetInnerHTML={{ __html: excerpt }} // Render HTML content
                    itemProp="articleBody"
                ></div>
                <div className="flex justify-between items-center">
                    <time className="text-sm text-gray-500" itemProp="datePublished" dateTime={isoDate}>{date}</time>
                    <Link 
                        to={`/blogs/${slug || id}`} 
                        className="mt-4 inline-block text-violet-400 px-4 py-2 rounded hover:text-violet-600 transition-colors"
                        aria-label={`Read full article: ${title}`}
                        itemProp="url"
                    >
                        Read Full Article
                    </Link>
                </div>
            </div>
        </motion.article>
    );
};

export default BlogCard;
