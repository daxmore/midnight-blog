import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReply, FaCommentDots, FaUserCircle, FaEllipsisV, FaTrash } from 'react-icons/fa';
import { useBlog } from '../../context/BlogContext';
import { useDeleteComment } from '../../context/DeleteCommentContext';

const CommentSection = ({ postId, comments = [] }) => {
    const [newComment, setNewComment] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [commentSuccess, setCommentSuccess] = useState(false);

    // Safely try to get DeleteCommentContext
    const deleteComment = useContext(DeleteCommentContext);

    if (!deleteComment) {
        console.warn("DeleteCommentContext is not available.");
        return <p>Error: Unable to delete comments at this time.</p>;
    }

    // Get addComment function from context
    const { addComment } = useBlog();

    // Safely try to get DeleteCommentContext
    let deleteContextValue = { deleteSuccess: false };
    try {
        deleteContextValue = useDeleteComment();
    } catch (error) {
        console.warn('DeleteCommentContext not available, delete functionality will be disabled');
    }

    const { deleteSuccess } = deleteContextValue;

    // Get the latest 5 comments, sorted by most recent first
    const latestComments = [...comments]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const handleSubmitComment = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setCommentError('');
        setCommentSuccess(false);

        try {
            // Validate inputs
            if (!commentAuthor.trim()) {
                setCommentError('Please enter your name');
                setIsSubmitting(false);
                return;
            }

            if (!newComment.trim()) {
                setCommentError('Please enter a comment');
                setIsSubmitting(false);
                return;
            }

            // Add the comment using context function
            addComment(postId, {
                author: commentAuthor.trim(),
                content: newComment.trim()
            });

            // Reset form
            setNewComment('');
            setCommentSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setCommentSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error adding comment:', error);
            setCommentError('Failed to add comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800"
        >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaCommentDots className="mr-3 text-blue-500" /> Comments
                {comments.length > 0 && (
                    <span className="ml-2 text-sm bg-blue-600 px-2 py-1 rounded-full">
                        {comments.length}
                    </span>
                )}
            </h2>

            <form onSubmit={handleSubmitComment} className="mb-8 bg-gray-800 p-5 rounded-lg">
                <div className="mb-4">
                    <label htmlFor="commentAuthor" className="block text-sm text-gray-400 mb-1 font-medium">
                        Your Name
                    </label>
                    <input
                        id="commentAuthor"
                        type="text"
                        placeholder="Enter your name"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="commentContent" className="block text-sm text-gray-400 mb-1 font-medium">
                        Your Comment
                    </label>
                    <textarea
                        id="commentContent"
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        disabled={isSubmitting}
                        required
                    />
                </div>

                {commentError && (
                    <div className="p-3 mb-4 bg-red-900/50 border border-red-700 rounded text-red-300">
                        {commentError}
                    </div>
                )}

                {commentSuccess && (
                    <div className="p-3 mb-4 bg-green-900/50 border border-green-700 rounded text-green-300">
                        Your comment has been added successfully!
                    </div>
                )}

                {deleteSuccess && (
                    <div className="p-3 mb-4 bg-green-900/50 border border-green-700 rounded text-green-300">
                        Comment deleted successfully!
                    </div>
                )}

                <button
                    type="submit"
                    className={`mt-2 px-6 py-3 rounded font-medium flex items-center transition-all duration-300 ${isSubmitting
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-900/50'
                        }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Posting...
                        </>
                    ) : (
                        'Post Comment'
                    )}
                </button>
            </form>

            {comments.length > 5 && (
                <div className="mb-6 text-sm text-gray-400 italic">
                    Showing the 5 most recent comments out of {comments.length} total
                </div>
            )}

            <AnimatePresence>
                {latestComments.length > 0 ? (
                    latestComments.map((comment) => (
                        <CommentThread key={comment.id} comment={comment} postId={postId} />
                    ))
                ) : (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-6 text-gray-400"
                    >
                        Be the first to share your thoughts!
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.section>
    );
};

const CommentThread = ({ comment, postId }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // Safely try to get DeleteCommentContext
    let deleteContextValue = {
        prepareDeleteComment: () => { },
        deleteComment: () => { },
        isDeletingComment: false
    };

    try {
        deleteContextValue = useDeleteComment();
    } catch (error) {
        console.warn('DeleteCommentContext not available, delete functionality will be disabled');
    }

    const { prepareDeleteComment, deleteComment, isDeletingComment } = deleteContextValue;

    // Ensure comment has all required properties
    const safeComment = {
        id: comment?.id || Date.now(),
        author: {
            name: comment?.author?.name || 'Anonymous',
            avatar: comment?.author?.avatar
        },
        content: comment?.content || 'No content',
        date: comment?.date || 'Unknown date',
        replies: comment?.replies || []
    };

    const handleDelete = () => {
        prepareDeleteComment(postId, safeComment.id);
        deleteComment();
        setShowMenu(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700 hover:border-gray-600 transition-colors relative"
        >
            {/* Three-dot menu */}
            <div className="absolute top-2 right-2">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                >
                    <FaEllipsisV className="text-gray-400 hover:text-white" />
                </button>

                {/* Dropdown menu */}
                {showMenu && (
                    <div className="absolute right-0 mt-1 w-36 bg-gray-700 rounded-md shadow-lg z-10 overflow-hidden">
                        <button
                            onClick={handleDelete}
                            disabled={isDeletingComment}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 flex items-center transition-colors"
                        >
                            <FaTrash className="mr-2" />
                            {isDeletingComment ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center mb-2">
                {safeComment.author.avatar ? (
                    <img
                        src={safeComment.author.avatar}
                        alt={safeComment.author.name}
                        className="w-10 h-10 rounded-full mr-4"
                    />
                ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-600 mr-4" />
                )}
                <div>
                    <h4 className="font-semibold">{safeComment.author.name}</h4>
                    <p className="text-sm text-gray-400">{safeComment.date}</p>
                </div>
            </div>
            <p className="text-gray-300 mb-4">{safeComment.content}</p>

            {safeComment.replies && safeComment.replies.length > 0 && (
                <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="text-blue-400 flex items-center hover:text-blue-300 transition-colors"
                >
                    <FaReply className="mr-2" />
                    {showReplies ? 'Hide' : 'View'} {safeComment.replies.length} {safeComment.replies.length === 1 ? 'Reply' : 'Replies'}
                </button>
            )}

            <AnimatePresence>
                {showReplies && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-8 mt-4 overflow-hidden"
                    >
                        {safeComment.replies.map(reply => (
                            <div key={reply.id || Math.random()} className="bg-gray-700 p-3 rounded-lg mb-2">
                                <div className="flex items-center mb-2">
                                    <FaUserCircle className="text-gray-500 mr-2" />
                                    <span className="font-medium">{reply.author?.name || 'Anonymous'}</span>
                                </div>
                                <p className="text-gray-300">{reply.content || 'No content'}</p>
                                {reply.date && <p className="text-xs text-gray-400 mt-1">{reply.date}</p>}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CommentSection;
