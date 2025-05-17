import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReply, FaCommentDots } from 'react-icons/fa';

const CommentSection = ({ postId, comments }) => {
    const [newComment, setNewComment] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');

    const handleSubmitComment = (e) => {
        e.preventDefault();
        // Implement comment submission logic
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-gray-900 p-6 rounded-lg"
        >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FaCommentDots className="mr-3" /> Comments
            </h2>

            <form onSubmit={handleSubmitComment} className="mb-8">
                <input
                    type="text"
                    placeholder="Your Name"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-full mb-4 p-2 bg-gray-800 rounded"
                    required
                />
                <textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 bg-gray-800 rounded h-32"
                    required
                />
                <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Post Comment
                </button>
            </form>

            <AnimatePresence>
                {comments?.length > 0 ? (
                    comments.map((comment) => <CommentThread key={comment.id} comment={comment} />)
                ) : (
                    <p>No comments yet.</p>
                )}
            </AnimatePresence>
        </motion.section>
    );
};

const CommentThread = ({ comment }) => {
    const [showReplies, setShowReplies] = useState(false);

    // Ensure comment has all required properties
    const safeComment = {
        author: {
            name: comment?.author?.name || 'Anonymous',
            avatar: comment?.author?.avatar || 'https://via.placeholder.com/150'
        },
        content: comment?.content || 'No content',
        date: comment?.date || 'Unknown date',
        replies: comment?.replies || []
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-800 p-4 rounded-lg mb-4"
        >
            <div className="flex items-center mb-2">
                <img
                    src={safeComment.author.avatar}
                    alt={safeComment.author.name}
                    className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                    <h4 className="font-semibold">{safeComment.author.name}</h4>
                    <p className="text-sm text-gray-400">{safeComment.date}</p>
                </div>
            </div>
            <p className="text-gray-300 mb-4">{safeComment.content}</p>

            {safeComment.replies.length > 0 && (
                <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="text-blue-400 flex items-center"
                >
                    <FaReply className="mr-2" />
                    {showReplies ? 'Hide' : 'View'} {safeComment.replies.length} Replies
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
                                <p className="text-gray-300">{reply.content || 'No content'}</p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CommentSection;
