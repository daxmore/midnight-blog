import express from 'express';
import { createBlog, getBlogs, getBlogById, deleteBlog, updateBlog } from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/blogs
// @desc    Create a new blog post
router.post('/', protect, createBlog);

// @route   GET /api/blogs
// @desc    Get all blog posts
router.get('/', getBlogs);

// @route   GET /api/blogs/:id
// @desc    Get a single blog post by ID
router.get('/:id', getBlogById);

// @route   PUT /api/blogs/:id
// @desc    Update a blog post
router.put('/:id', protect, updateBlog);

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog post
router.delete('/:id', protect, deleteBlog);

export default router;
