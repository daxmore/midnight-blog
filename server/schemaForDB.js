import mongoose from 'mongoose';

// This file outlines the recommended MongoDB schema structure based on the
// existing data handling in the BlogContext. This schema is designed for
// use with Mongoose, a popular ODM (Object Data Modeling) library for MongoDB.

// ==================================
// Sub-document Schemas
// ==================================

/**
 * @schema AuthorSchema
 * Defines the structure for a blog post author.
 * This can be embedded in the BlogSchema or kept as a separate collection
 * and referenced if authors can write multiple posts. For simplicity,
 * we are embedding it here.
 */
const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Anonymous Author'
    },
    avatar: {
        type: String, // URL to the avatar image
        default: 'https://via.placeholder.com/150'
    },
    bio: {
        type: String,
        maxlength: [500, 'Author bio cannot exceed 500 characters.'],
        default: 'Information about this author is not available.'
    },
    socialLinks: [{
        platform: {
            type: String,
            enum: ['twitter', 'github', 'linkedin']
        },
        url: String
    }]
});


// ==================================
// Main Blog Schema
// ==================================

/**
 * @schema BlogSchema
 * Defines the main structure for a blog post.
 * This schema brings together the author and content.
 */
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required.'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters.']
    },
    slug: {
        type: String,
        required: [true, 'A URL-friendly slug is required.'],
        unique: true,
        trim: true
    },
    content: {
        type: String, // Storing as HTML from the rich text editor
        required: [true, 'Blog content is required.']
    },
    excerpt: {
        type: String,
        required: [true, 'A short excerpt is required.'],
        maxlength: [300, 'Excerpt cannot exceed 300 characters.']
    },
    category: {
        type: String,
        required: [true, 'Category is required.'],
        trim: true,
        enum: [ // Based on categories in CreateBlogPost.jsx
            'Development',
            'Design',
            'Technology',
            'Artificial Intelligence',
            'Web Development',
            'Machine Learning',
            'Uncategorized'
        ],
        default: 'Uncategorized'
    },
    featuredImage: {
        type: String, // URL or base64 string
        required: false
    },
    author: {
        type: AuthorSchema, // Embedded author sub-document
        default: () => ({}) // Ensures a default author object is created
    },
    readTime: {
        type: String,
        default: '5 min read'
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: { createdAt: 'publishedAt', updatedAt: 'updatedAt' }
});

// ==================================
// Indexing for Performance
// ==================================

// Indexing the 'slug' and 'category' fields will significantly improve query performance
// for fetching posts by slug or filtering by category.
BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ publishedAt: -1 }); // For sorting by most recent

// ==================================
// Mongoose Model
// ==================================

// The model is what allows you to interact with the 'blogs' collection in MongoDB.
// If the model name is 'Blog', Mongoose will look for a collection named 'blogs'.
export const Blog = mongoose.model('Blog', BlogSchema);

// Example of how to use this model in a backend service:
/*
    import { Blog } from './schemaForDB';

    // Create a new blog post
    const newPost = new Blog({
        title: 'My First Post',
        slug: 'my-first-post',
        content: '<p>This is the content.</p>',
        excerpt: 'This is the excerpt.',
        category: 'Technology',
        author: { name: 'John Doe' }
    });

    newPost.save()
        .then(post => console.log('Post saved:', post))
        .catch(err => console.error('Error saving post:', err));

    // Find a blog post
    Blog.findOne({ slug: 'my-first-post' })
        .then(post => console.log('Found post:', post));
*/