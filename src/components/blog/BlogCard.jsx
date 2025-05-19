import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEllipsisV, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { BlogContext } from '../../context/BlogContext';

const BlogCard = ({ title, excerpt, imageUrl, date, category, index, id, slug }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { removeBlog } = useContext(BlogContext);

    // Format date for structured data
    const isoDate = new Date(date).toISOString ? new Date(date).toISOString() : '';

    // Clean up excerpt by removing HTML tags and limiting length
    const cleanExcerpt = excerpt 
        ? excerpt.replace(/<[^>]*>?/gm, '').slice(0, 120) + (excerpt.length > 120 ? '...' : '')
        : '';

    // Format title to be more readable
    const formattedTitle = title.length > 30 ? title.slice(0, 30) + '...' : title;

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
                        className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                        aria-label="Options menu"
                    >
                        <FaEllipsisV className="text-gray-400 hover:text-white" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-1 w-36 bg-gray-700 rounded-md shadow-lg z-10 overflow-hidden">
                            <button
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 flex items-center transition-colors"
                                onClick={() => {
                                    setMenuOpen(false);
                                    removeBlog(id);
                                }}
                                aria-label="Delete blog post"
                            >
                                <FaTrash className="mr-2" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-xs mb-2">
                    {category || 'Uncategorized'}
                </span>
                <h3 className="text-xl font-bold mb-2 text-white" itemProp="name">
                    {formattedTitle}
                </h3>
                <div
                    className="text-gray-400 mb-4 min-h-[80px]"
                    dangerouslySetInnerHTML={{ __html: cleanExcerpt }}
                    itemProp="articleBody"
                />
                <div className="flex justify-between items-center">
                    <time className="text-sm text-gray-500" itemProp="datePublished" dateTime={isoDate}>
                        {new Date(date).toLocaleDateString()}
                    </time>
                    <Link 
                        to={`/blogs/${slug}`} 
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
