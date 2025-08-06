import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const BlogContext = createContext();

export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
};

const API_URL = 'http://localhost:2500/api'; // Your backend URL

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Effect to fetch blogs on component mount
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
    }, []); // Empty dependency array means it runs once on mount

    // Function to add a blog
    const addBlog = useCallback(async (blogData) => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
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
            if (err.response) {
                throw new Error(err.response.data.msg || 'Server Error');
            } else if (err.request) {
                throw new Error('Network error. Please ensure the server is running.');
            } else {
                throw new Error(err.message);
            }
        }
    }, []);

    // Function to remove a blog
    const removeBlog = useCallback((id) => {
        // This will be updated to make an API call
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
    }, []);

    // Function to get a blog by slug
    const getBlogById = (slug) => {
        return blogs.find((blog) => blog.slug === slug);
    };

    const contextValue = {
        blogs,
        addBlog,
        removeBlog,
        getBlogById,
        loading,
        setBlogs
    };

    return (
        <BlogContext.Provider value={contextValue}>
            {children}
        </BlogContext.Provider>
    );
};
