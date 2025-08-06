import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Anonymous Author'
    },
    avatar: {
        type: String, // URL to the avatar image
        default: '/src/assets/images/daxmore.jpg'
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    readTime: {
        type: String,
        default: '5 min read'
    },
}, {
    timestamps: true
});

BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ publishedAt: -1 });

export const Blog = mongoose.model('Blog', BlogSchema, 'blog_data');