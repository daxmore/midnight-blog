# How to Build a MERN Stack Blog Application

This guide outlines the process of building a full-stack blog application using the MERN (MongoDB, Express.js, React, Node.js) stack. We'll cover setting up the backend API, connecting it to the React frontend, and implementing user authentication for blog post management.

## 1. Setting Up the Backend Server

Your `server/index.js` file serves as the entry point for your backend. It sets up the Express server, connects to MongoDB, and defines middleware and routes.

```javascript
// server/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27019/midnight_blog')
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 2500;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

**To run this server:**

1.  **Install dependencies:** Navigate to the `server` directory and run `npm install`.
2.  **Environment Variables:** Create a `.env` file in the `server` directory with your MongoDB connection string and a JWT secret:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_long_random_jwt_secret
    ```
3.  **Start the server:** `npx nodemon index.js` (or `node index.js` if nodemon is not installed).

## 2. Backend API Endpoints

This section details the API endpoints for user authentication and blog post management.

### User Authentication (`server/routes/authRoutes.js` & `server/controllers/authController.js`)

-   **`POST /api/auth/signup`**: Registers a new user.
-   **`POST /api/auth/signin`**: Authenticates a user and returns a JSON Web Token (JWT).

### Blog Post Management (`server/routes/blogRoutes.js` & `server/controllers/blogController.js`)

-   **`POST /api/blogs`**: Creates a new blog post. This route is protected by authentication middleware.
-   **`GET /api/blogs`**: Fetches all blog posts.
-   **`GET /api/blogs/:slug`**: Fetches a single blog post by its URL slug.

**Example `createBlog` Controller Logic:**

```javascript
// server/controllers/blogController.js
import { Blog } from '../models/blog.js';

export const createBlog = async (req, res) => {
    try {
        const { title, content, category, image, excerpt, author } = req.body;
        const user = req.user._id; // User ID from authenticated request

        // ... (validation and slug generation)

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
        res.status(201).json(savedBlog);
    } catch (err) {
        console.error('Error saving blog:', err.message);
        res.status(500).send('Server Error');
    }
};
```

## 3. Connecting the Frontend

Your React frontend interacts with these API endpoints using `axios`.

### `BlogContext.jsx`

This context now handles fetching and posting blog data to the backend API.

```javascript
// client/src/context/BlogContext.jsx
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const BlogContext = createContext();

const API_URL = 'http://localhost:2500/api'; // Your backend URL

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
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in to create a post.');
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const res = await axios.post(`${API_URL}/blogs`, blogData, config);
            setBlogs((prevBlogs) => [res.data, ...prevBlogs]);
        } catch (err) {
            console.error('Error adding blog:', err);
            throw new Error(err.response?.data?.msg || err.message || 'Server Error');
        }
    }, []);

    // ... (other functions like removeBlog, getBlogById)

    const contextValue = {
        blogs,
        addBlog,
        loading,
        // ... other values
    };

    return (
        <BlogContext.Provider value={contextValue}>
            {children}
        </BlogContext.Provider>
    );
};
```

### `AuthContext.jsx`

This new context manages user authentication state and provides login/logout functionality.

```javascript
// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setCurrentUser({ username: 'Logged In User' }); // Replace with actual user data from token
        }
        setLoading(false);
    }, []);

    const login = useCallback((token, user) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setCurrentUser(user);
        navigate('/');
    }, [navigate]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setCurrentUser(null);
        navigate('/signin');
    }, [navigate]);

    const contextValue = {
        isLoggedIn,
        currentUser,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
```

### `CreateBlogPost.jsx`

This component now calls the `addBlog` function from `useBlog()` to send data to the backend.

```javascript
// client/src/pages/CreateBlogPost.jsx
const CreateBlogPost = () => {
    const { addBlog } = useBlog();
    // ... (state and other logic)

    const handleAddBlog = async () => {
        // ... (validation and image data handling)

        const blogData = {
            title,
            content: editor.getHTML(),
            category,
            image: imageData,
            excerpt: editor.getText().slice(0, 150) + '...',
            author: 'Dax More' // This will be replaced by actual user data from backend
        };

        try {
            await addBlog(blogData);
            // ... (reset form and show success popup)
        } catch (error) {
            console.error('Error adding blog:', error);
            alert(error.message);
        }
    };
    // ... (rest of the component)
};
```

## 4. Displaying Data

`BlogDetailsPage.jsx` and other components now get their data from the `BlogContext`, which is populated from the backend. The `BlogCard.jsx` component now uses `post._id` as the `key` prop and `post.featuredImage` and `post.createdAt` for data display.

## Next Steps

*   **Admin Panel**: With user IDs associated with blog posts, you can now build an admin panel to manage content based on authors.
*   **User Profile Management**: Expand `AuthContext` to handle user profile updates.
*   **Error Handling**: Add more robust error handling on both the client and server.
*   **File Uploads**: For `featuredImage`, consider implementing dedicated file upload services (e.g., using `multer` on the backend and cloud storage like Cloudinary) instead of base64 encoding for very large images.

This guide provides a comprehensive overview of the MERN stack integration in your Midnight Blog application.
