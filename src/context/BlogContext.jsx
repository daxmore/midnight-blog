// import all the necessary libraries like { createContext, useContext, useState } 
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

//  create a context for the blog
export const BlogContext = createContext();

// create a custom hook to use the BlogContext
export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
}

// Helper function to check available storage
const checkStorageQuota = () => {
    try {
        // Check if localStorage is available
        if (!window.localStorage) {
            return false;
        }
        
        // Try to estimate available space
        let available = true;
        const testKey = '_storage_test_';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        
        return available;
    } catch (e) {
        return false;
    }
};

// Function to limit text content to a safe size
const limitContentSize = (content, maxSize = 1000) => {
    if (!content) return '';
    
    if (typeof content === 'string' && content.length > maxSize) {
        return content.slice(0, maxSize) + '... (content truncated)';
    }
    
    return content;
};

// Safe blog serializer - prepares blogs for storage
const prepareBlogsForStorage = (blogs) => {
    return blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        content: limitContentSize(blog.content),
        excerpt: limitContentSize(blog.excerpt, 200),
        category: blog.category,
        date: blog.date,
        author: blog.author,
        readTime: blog.readTime,
        image: blog.image,
        // Omit large data like comments or limit their size
        comments: blog.comments ? blog.comments.slice(0, 5) : []
    }));
};

// to save blog data in the local storage
const saveBlogDataToLocalStorage = (posts) => {
    if (!checkStorageQuota()) {
        console.warn('Storage quota might be exceeded, using in-memory storage only');
        return false;
    }

    try {
        // First try to save only the essential data
        const simplifiedPosts = prepareBlogsForStorage(posts);
        localStorage.setItem('blogs', JSON.stringify(simplifiedPosts));
        return true;
    } catch (error) {
        console.error('Error saving blog data to local storage:', error);
        
        try {
            // If error occurs, try to save only last 10 posts
            if (posts.length > 10) {
                const reducedPosts = prepareBlogsForStorage(posts.slice(-10));
                localStorage.setItem('blogs', JSON.stringify(reducedPosts));
                console.warn('Saved only the 10 most recent blog posts due to storage limitations');
                return true;
            }
            
            // If still fails with 10 posts, try clearing storage and saving just the latest post
            if (posts.length > 0) {
                localStorage.clear();
                const latestPost = prepareBlogsForStorage([posts[posts.length - 1]]);
                localStorage.setItem('blogs', JSON.stringify(latestPost));
                console.warn('Storage limitations forced saving only the latest blog post');
                return true;
            }
        } catch (fallbackError) {
            console.error('Could not save any blog data to storage:', fallbackError);
            // Last resort: clear storage
            try {
                localStorage.removeItem('blogs');
            } catch (e) {
                // If even removal fails, we can't do anything with localStorage
            }
        }
        return false;
    }
};

export const BlogProvider = ({ children }) => {
    // use the useState hook to manage the state of the blogs array
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [persistenceEnabled, setPersistenceEnabled] = useState(true);

    // function to add a blog
    const addBlog = useCallback((blog) => {
        // Ensure slug is properly set
        const slug = blog.slug || 
            (blog.title ? blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `post-${Date.now()}`);
        
        // Limit content size before saving
        const safeContent = limitContentSize(blog.content);
        
        const newBlog = {
            ...blog,
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            slug: slug,
            content: safeContent
        };
        
        console.log('Adding new blog with data:', newBlog);

        setBlogs((prevBlogs) => {
            const updatedBlogs = [...prevBlogs, newBlog];
            
            // Try to persist, but don't fail if storage is full
            if (persistenceEnabled) {
                const success = saveBlogDataToLocalStorage(updatedBlogs);
                if (!success) {
                    setPersistenceEnabled(false);
                }
            }
            
            return updatedBlogs;
        });
    }, [persistenceEnabled]);

    // function to remove a blog
    const removeBlog = useCallback((id) => {
        setBlogs((prevBlogs) => {
            const updatedBlogs = prevBlogs.filter((blog) => blog.id !== id);
            
            if (persistenceEnabled) {
                const success = saveBlogDataToLocalStorage(updatedBlogs);
                if (!success) {
                    setPersistenceEnabled(false);
                }
            }
            
            return updatedBlogs;
        });
    }, [persistenceEnabled]);

    const getBlogById = (identifier) => {
        if (!identifier) {
            console.error('Blog identifier is undefined or null');
            return null;
        }
        
        // Try parsing as a number if it's a string that looks like a number
        const numericId = !isNaN(identifier) ? parseInt(identifier, 10) : null;
        
        // Handle the case where the identifier might be a string representation of a number
        const stringId = identifier.toString();
        
        // Find the blog by id or slug
        const blog = blogs.find((blog) => {
            // Compare as numbers if both are numbers
            const idMatch = 
                blog.id === identifier || 
                blog.id === numericId || 
                blog.id.toString() === stringId;
                
            // Compare slugs as strings
            const slugMatch = blog.slug === identifier;
            
            return idMatch || slugMatch;
        });
        
        if (!blog) {
            console.warn(`No blog found with identifier: ${identifier}`);
        }
        
        return blog;
    };

    // create a context value that will be passed to the provider and used in the component
    const contextValue = {
        blogs,
        addBlog,
        removeBlog,
        getBlogById,
        loading,
        persistenceEnabled
    };

    // local storage to persist the data and use the useEffect hook to load the data from local storage
    // to save the data to local storage
    useEffect(() => {
        if (blogs.length > 0 && persistenceEnabled) {
            const success = saveBlogDataToLocalStorage(blogs);
            if (!success) {
                setPersistenceEnabled(false);
            }
        }
    }, [blogs, persistenceEnabled]);

    // to load the data from local storage
    useEffect(() => {
        const getBlogDataFromLocalStorage = () => {
            try {
                const savedBlogData = localStorage.getItem('blogs');
                if (savedBlogData) {
                    const parsedData = JSON.parse(savedBlogData);
                    setBlogs(parsedData);
                }
            } catch (error) {
                console.error('Error loading blogs from localStorage:', error);
                setPersistenceEnabled(false);
            } finally {
                setLoading(false);
            }
        };

        getBlogDataFromLocalStorage();
    }, []);

    // use the context in the component
    return (
        <BlogContext.Provider value={contextValue}>
            {children}
        </BlogContext.Provider>
    );
};