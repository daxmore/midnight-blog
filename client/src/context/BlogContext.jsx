// import all the necessary libraries like { createContext, useContext, useState } 
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

//  create a context for the blog
export const BlogContext = createContext();

// Constants for storage
const STORAGE_KEY = 'blogs';

// create a custom hook to use the BlogContext
export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
}

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load blogs from localStorage on initial render
    useEffect(() => {
        try {
            const savedBlogData = localStorage.getItem(STORAGE_KEY);
            if (savedBlogData) {
                setBlogs(JSON.parse(savedBlogData));
            }
        } catch (error) {
            console.error('Error loading blogs from localStorage:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Store blogs in localStorage whenever they change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
        }
    }, [blogs, loading]);

    // function to add a blog
    const addBlog = useCallback((blog) => {
        const slug = blog.slug ||
            (blog.title ? blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `post-${Date.now()}`);

        const newBlog = {
            ...blog,
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            slug: slug,
        };

        setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
    }, []);

    // function to remove a blog
    const removeBlog = useCallback((id) => {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
    }, []);

    const getBlogById = (identifier) => {
        if (!identifier) {
            return null;
        }
        const stringId = identifier.toString();

        return blogs.find((blog) => {
            const idMatch = blog.id.toString() === stringId;
            const slugMatch = blog.slug === identifier;
            return idMatch || slugMatch;
        });
    };

    // create a context value that will be passed to the provider and used in the component
    const contextValue = {
        blogs,
        addBlog,
        removeBlog,
        getBlogById,
        loading,
        setBlogs
    };

    // use the context in the component
    return (
        <BlogContext.Provider value={contextValue}>
            {children}
        </BlogContext.Provider>
    );
};