# How to Connect the Frontend to a MERN Stack Backend

This guide will walk you through the process of connecting your React frontend to a Node.js, Express, and MongoDB backend. We'll cover how to insert and display blog posts from your database.

## 1. Setting Up the Server

First, you need to set up a basic Express server. Your `server/index.js` file will be the entry point for your backend.

```javascript
// server/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Blog } from './schemaForDB.js'; // Your Mongoose model

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = 'your_mongodb_connection_string'; // Replace with your MongoDB connection string
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**To run this server:**

1.  **Install dependencies:** `npm install express mongoose cors`
2.  **Start the server:** `node server/index.js`

## 2. Creating API Endpoints

Next, you'll create API endpoints to handle creating and fetching blog posts.

### Inserting a Blog Post

Create a `POST` endpoint to handle the creation of a new blog post. This endpoint will receive data from your React form and save it to the database.

```javascript
// Add this to server/index.js

app.post('/api/blogs', async (req, res) => {
    try {
        const { title, content, category, image, excerpt, author } = req.body;

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
            author: { name: author || 'Anonymous' } // Assuming author is just a name for now
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
```

### Displaying Blog Posts

Create a `GET` endpoint to fetch all blog posts from the database.

```javascript
// Add this to server/index.js

app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ publishedAt: -1 }); // Get newest posts first
        res.json(blogs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
```

Create another `GET` endpoint to fetch a single blog post by its slug.

```javascript
// Add this to server/index.js

app.get('/api/blogs/:slug', async (req, res) => {
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
});
```

## 3. Connecting the Frontend

Now, you'll modify your React components to interact with these new API endpoints. You'll need a library like `axios` to make HTTP requests.

**Install axios:** `npm install axios`

### Updating `BlogContext.jsx`

Modify your `BlogContext.jsx` to fetch data from the backend instead of `localStorage`.

```javascript
// client/src/context/BlogContext.jsx

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const BlogContext = createContext();

export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
}

const API_URL = 'http://localhost:5000/api'; // Your backend URL

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`${API_URL}/blogs`);
                setBlogs(res.data);
            } catch (err) {
                console.error('Error fetching blogs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const addBlog = useCallback(async (blogData) => {
        try {
            const res = await axios.post(`${API_URL}/blogs`, blogData);
            setBlogs((prevBlogs) => [res.data, ...prevBlogs]);
        } catch (err) {
            console.error('Error adding blog:', err);
            // You might want to throw the error to handle it in the component
            throw new Error(err.response.data.msg || 'Server Error');
        }
    }, []);

    // ... (removeBlog, addComment, etc. would also be updated to make API calls)

    const getBlogById = (slug) => {
        // This can now fetch from the backend if needed, or find from the already loaded blogs
        return blogs.find((blog) => blog.slug === slug);
    };

    const contextValue = {
        blogs,
        addBlog,
        // ... other functions
        getBlogById,
        loading,
    };

    return (
        <BlogContext.Provider value={contextValue}>
            {children}
        </BlogContext.Provider>
    );
};
```

### Updating `CreateBlogPost.jsx`

Your `CreateBlogPost.jsx` component will now call the `addBlog` function from the context, which in turn makes an API call to the backend.

```javascript
// client/src/pages/CreateBlogPost.jsx

// ... (imports)

const CreateBlogPost = () => {
    const { addBlog } = useBlog();
    // ... (state and other logic)

    const handleAddBlog = async () => {
        if (!title || !content || !category) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const blogData = {
                title,
                content: editor.getHTML(),
                category,
                image: imageUrl, // Or handle file uploads
                excerpt: editor.getText().slice(0, 150) + '...',
                author: 'Your Name' // Replace with actual author data
            };

            await addBlog(blogData);

            // Reset form
            // ...

        } catch (error) {
            console.error('Error adding blog:', error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ... (return statement)
};
```

## 4. Displaying Data

Your `BlogDetailsPage.jsx` and other components that display blog data should now work as expected, as they get their data from the `BlogContext`, which is now populated from the backend.

## Next Steps

*   **File Uploads:** For the `featuredImage`, you'll need to implement file uploads on the server. Libraries like `multer` are great for this.
*   **Authentication:** Implement user authentication to manage who can create and edit posts.

*   **Error Handling:** Add more robust error handling on both the client and server.
*   **Environment Variables:** Use a `.env` file to store your `MONGO_URI` and other sensitive information.

This guide provides a basic foundation. As you continue to build your MERN stack application, you'll expand on these concepts to create a more feature-rich and secure application.
