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
    const [page, setPage] = useState(1); // Current page
    const [pages, setPages] = useState(1); // Total pages
    const [totalBlogs, setTotalBlogs] = useState(0); // Total number of blogs

    // Function to fetch blogs with pagination
    const fetchBlogs = useCallback(async (pageNumber = 1, limit = 10) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/blogs?page=${pageNumber}&limit=${limit}`);
            setBlogs(res.data.blogs);
            setPage(res.data.page);
            setPages(res.data.pages);
            setTotalBlogs(res.data.total); // Set totalBlogs
        } catch (err) {
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to fetch blogs on component mount or when fetchBlogs changes
    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]); // fetchBlogs is now a dependency

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
            // After adding, re-fetch to update the list with pagination
            fetchBlogs(page); // Re-fetch current page
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
    }, [fetchBlogs, page]); // fetchBlogs and page are dependencies

    // Function to remove a blog
    const removeBlog = useCallback(async (id) => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            if (!token) {
                throw new Error('You must be logged in to delete a post.');
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.delete(`${API_URL}/blogs/${id}`, config);
            // After removing, re-fetch to update the list with pagination
            fetchBlogs(page); // Re-fetch current page
        } catch (err) {
            console.error('Error removing blog:', err);
            if (err.response) {
                throw new Error(err.response.data.msg || 'Server Error');
            } else if (err.request) {
                throw new Error('Network error. Please ensure the server is running.');
            } else {
                throw new Error(err.message);
            }
        }
    }, [fetchBlogs, page]); // fetchBlogs and page are dependencies

    // Function to get a blog by ID from the context's state
    const getBlogByIdFromContext = (id) => {
        return blogs.find((blog) => blog._id === id);
    };

    // Function to update a blog
    const updateBlog = useCallback(async (id, blogData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in to update a post.');
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const res = await axios.put(`${API_URL}/blogs/${id}`, blogData, config);
            // After updating, re-fetch to update the list with pagination
            fetchBlogs(page); // Re-fetch current page
        } catch (err) {
            console.error('Error updating blog:', err);
            if (err.response) {
                throw new Error(err.response.data.msg || 'Server Error');
            } else if (err.request) {
                throw new Error('Network error. Please ensure the server is running.');
            } else {
                throw new Error(err.message);
            }
        }
    }, [fetchBlogs, page]); // fetchBlogs and page are dependencies

    const contextValue = {
        blogs,
        loading,
        page, // Exposed page
        pages, // Exposed pages
        totalBlogs, // Exposed totalBlogs
        fetchBlogs, // Exposed fetchBlogs
        addBlog,
        removeBlog,
        updateBlog,
        getBlogByIdFromContext,
        setBlogs // Keep setBlogs if needed elsewhere, but fetchBlogs should be preferred for updates
    };

    return (
        <BlogContext.Provider value={contextValue}>
            {children}
        </BlogContext.Provider>
    );
};
