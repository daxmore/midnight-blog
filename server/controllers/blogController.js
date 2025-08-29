import { Blog } from '../models/blog.js';
import { validationResult } from 'express-validator';

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Public (for now, will be protected later)
export const createBlog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, content, category, image, excerpt, author } = req.body;

        // Get user from req.user (set by protect middleware)
        const user = req.user._id;

        // Create a slug from the title
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const newBlog = new Blog({
            title,
            slug,
            content,
            category,
            featuredImage: image,
            excerpt,
            author: { name: author || 'Anonymous' },
            user, // Assign the user ID
        });

        const savedBlog = await newBlog.save();
        console.log('Saved new blog to DB:', savedBlog); // ADDED THIS LINE
        res.status(201).json(savedBlog);
    } catch (err) {
        console.error('Error saving blog:', err.message); // IMPROVED ERROR LOGGING
        res.status(500).send('Server Error');
    }
};

// @desc    Get all blog posts with pagination
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
    const pageSize = parseInt(req.query.limit) || 10; // Number of blogs per page
    const page = parseInt(req.query.page) || 1; // Current page number

    try {
        const count = await Blog.countDocuments(); // Total number of blogs
        const blogs = await Blog.find()
            .sort({ publishedAt: -1 }) // Get newest posts first
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            blogs,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single blog post by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') { // Add this check for invalid IDs
            return res.status(404).json({ msg: 'Blog not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, image, excerpt, author } = req.body;
    console.log('Received update request for blog ID:', req.params.id);
    console.log('Request body:', req.body);

    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            console.log('Blog not found for ID:', req.params.id);
            return res.status(404).json({ msg: 'Blog not found' });
        }

        // Check user
        // If blog.user is undefined, only an admin can update it.
        // Otherwise, check if the logged-in user is the blog owner or an admin.
        if (blog.user && blog.user.toString() !== req.user.id && req.user.role !== 'admin') {
            console.log('User not authorized. Blog owner:', blog.user.toString(), 'Current user:', req.user.id, 'Role:', req.user.role);
            return res.status(401).json({ msg: 'User not authorized to update this blog' });
        } else if (!blog.user && req.user.role !== 'admin') {
            console.log('Blog has no associated user. Only admin can update. Current user role:', req.user.role);
            return res.status(401).json({ msg: 'User not authorized to update this blog (blog has no owner and you are not an admin)' });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.category = category || blog.category;
        blog.featuredImage = image || blog.featuredImage;
        blog.excerpt = excerpt || blog.excerpt;
        blog.author = author ? { name: author } : blog.author;
        blog.updatedAt = Date.now(); // Update the timestamp

        // Ensure the 'user' field is present. If it's missing from the retrieved blog,
        // assign the current authenticated user's ID. This handles legacy blogs.
        if (!blog.user) {
            blog.user = req.user._id;
        }

        // Re-generate slug if title changes
        if (title && title !== blog.title) {
            blog.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        const updatedBlog = await blog.save();
        console.log('Blog updated successfully:', updatedBlog._id);
        res.json(updatedBlog);
    } catch (err) {
        console.error('Error in updateBlog:', err); // Log the full error object
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        // Check for Mongoose validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }

        // Check if the logged-in user is the blog owner or an admin
        if (blog.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized to delete this blog' });
        }

        await blog.deleteOne(); // Use deleteOne() for Mongoose 6+

        res.json({ msg: 'Blog removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        res.status(500).send('Server Error');
    }
};
