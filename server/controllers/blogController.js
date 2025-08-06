import { Blog } from '../models/blog.js';

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Public (for now, will be protected later)
export const createBlog = async (req, res) => {
    try {
        const { title, content, category, image, excerpt, author } = req.body;

        // Get user from req.user (set by protect middleware)
        const user = req.user._id;

        // Basic validation
        if (!title || !content || !category) {
            return res.status(400).json({ msg: 'Please enter all required fields.' });
        }

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

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ publishedAt: -1 }); // Get newest posts first
        console.log('Fetched blogs from DB:', blogs); // <--- ADDED THIS LINE
        res.json(blogs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single blog post by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
