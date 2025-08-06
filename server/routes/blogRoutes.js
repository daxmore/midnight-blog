import express from 'express';
import { createBlog, getBlogs, getBlogBySlug } from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/blogs
// @desc    Create a new blog post
router.post('/', protect, createBlog);

// @route   GET /api/blogs
// @desc    Get all blog posts
router.get('/', getBlogs);

// @route   GET /api/blogs/:slug
// @desc    Get a single blog post by slug
router.get('/:slug', getBlogBySlug);

export default router;
