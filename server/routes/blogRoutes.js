import express from 'express';
import { createBlog, getBlogs, getBlogById, deleteBlog, updateBlog } from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules for creating and updating a blog
const blogValidationRules = [
    body('title', 'Title is required').not().isEmpty().trim().escape(),
    body('content', 'Content is required').not().isEmpty(),
    body('category', 'Category is required').not().isEmpty(),
    body('image', 'Invalid image URL').optional({ checkFalsy: true }).isURL(),
];

// @route   POST /api/blogs
// @desc    Create a new blog post
router.post('/', protect, blogValidationRules, createBlog);

// @route   GET /api/blogs
// @desc    Get all blog posts
router.get('/', getBlogs);

// @route   GET /api/blogs/:id
// @desc    Get a single blog post by ID
router.get('/:id', getBlogById);

// @route   PUT /api/blogs/:id
// @desc    Update a blog post
router.put('/:id', protect, blogValidationRules, updateBlog);

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog post
router.delete('/:id', protect, deleteBlog);

export default router;
