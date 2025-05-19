// import all the necessary libraries like { createContext, useContext, useState } 
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

//  create a context for the blog
export const BlogContext = createContext();

// Constants for storage
const STORAGE_KEY = 'blogs';
const MAX_CONTENT_SIZE = 30000; // Maximum size for content in characters
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // Approx 5MB limit (typical localStorage limit)
const WARNING_THRESHOLD = 0.8; // Show warning when 80% of storage is used

// create a custom hook to use the BlogContext
export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
}

// Helper to calculate storage usage percentage
const getStorageUsage = () => {
    try {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length * 2; // Unicode characters can use up to 2 bytes
            }
        }
        
        return {
            totalBytes: totalSize,
            percentUsed: totalSize / MAX_STORAGE_SIZE,
            isNearingLimit: totalSize / MAX_STORAGE_SIZE > WARNING_THRESHOLD
        };
    } catch (e) {
        return {
            totalBytes: 0,
            percentUsed: 0,
            isNearingLimit: false
        };
    }
};

// Helper function to check available storage
const checkStorageQuota = () => {
    try {
        // Check if localStorage is available
        if (!window.localStorage) {
            return {
                available: false,
                message: "localStorage is not available in this browser"
            };
        }

        // Try to estimate available space
        const testKey = '_storage_test_';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        
        // Calculate current usage
        const usage = getStorageUsage();
        
        return {
            available: true,
            usageData: usage,
            message: usage.isNearingLimit 
                ? `Storage usage is high (${Math.round(usage.percentUsed * 100)}%)`
                : "Storage is available"
        };
    } catch (e) {
        return {
            available: false,
            message: "Error accessing localStorage: " + e.message
        };
    }
};

// Function to limit text content to a safe size
const limitContentSize = (content, maxSize = MAX_CONTENT_SIZE) => {
    if (!content) return '';

    if (typeof content === 'string' && content.length > maxSize) {
        return {
            truncated: true,
            originalSize: content.length,
            newSize: maxSize,
            content: content.slice(0, maxSize) + '... (content truncated)'
        };
    }

    return {
        truncated: false,
        originalSize: content?.length || 0,
        newSize: content?.length || 0,
        content: content
    };
};

// Estimate the size of a blog post in bytes
const estimateBlogSize = (blog) => {
    try {
        // Quick estimation by JSON stringify
        const jsonString = JSON.stringify(blog);
        return jsonString.length * 2; // Unicode characters can use up to 2 bytes
    } catch (e) {
        // Fallback size estimation for complex objects
        let size = 0;
        
        // Estimate major fields
        if (blog.title) size += blog.title.length * 2;
        if (blog.content) size += blog.content.length * 2;
        if (blog.excerpt) size += blog.excerpt.length * 2;
        if (blog.image) size += 1000; // Assume URL is around 500 bytes
        if (blog.comments) size += blog.comments.length * 500; // Rough estimate per comment
        
        return size;
    }
};

// Safe blog serializer - prepares blogs for storage
const prepareBlogsForStorage = (blogs) => {
    const storageStatus = checkStorageQuota();
    const processed = [];
    let totalSize = 0;
    let truncationWarnings = [];
    
    // Sort blogs by date (newest first) to prioritize recent content
    const sortedBlogs = [...blogs].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
    
    for (const blog of sortedBlogs) {
        // Process content fields with potential truncation
        const processedContent = limitContentSize(blog.content, 5000); // Reduced from 30000
        const processedExcerpt = limitContentSize(blog.excerpt, 100); // Reduced from 200
        
        // Track any truncation
        if (processedContent.truncated) {
            truncationWarnings.push({
                id: blog.id,
                title: blog.title,
                field: 'content',
                originalSize: processedContent.originalSize,
                newSize: processedContent.newSize
            });
        }
        
        if (processedExcerpt.truncated) {
            truncationWarnings.push({
                id: blog.id,
                title: blog.title,
                field: 'excerpt',
                originalSize: processedExcerpt.originalSize,
                newSize: processedExcerpt.newSize
            });
        }
        
        // Process comments - keep only the 10 most recent comments
        const processedComments = blog.comments 
            ? blog.comments
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map(comment => ({
                    id: comment.id,
                    author: comment.author,
                    content: limitContentSize(comment.content, 500).content, // Limit comment content
                    date: comment.date,
                    replies: comment.replies?.slice(0, 3) || [] // Keep only 3 most recent replies
                }))
            : [];
        
        const processedBlog = {
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            content: processedContent.content,
            excerpt: processedExcerpt.content,
            category: blog.category,
            date: blog.date,
            author: blog.author,
            readTime: blog.readTime,
            image: blog.image,
            comments: processedComments
        };
        
        const blogSize = estimateBlogSize(processedBlog);
        totalSize += blogSize;
        
        // If we're approaching the storage limit, stop processing more blogs
        if (totalSize > MAX_STORAGE_SIZE * 0.8) {
            console.warn(`Storage limit reached after processing ${processed.length} blogs`);
            break;
        }
        
        processed.push({
            ...processedBlog,
            _meta: {
                size: blogSize,
                contentTruncated: processedContent.truncated,
                excerptTruncated: processedExcerpt.truncated,
                commentsTruncated: blog.comments?.length > 10
            }
        });
    }
    
    return {
        blogs: processed,
        storageInfo: {
            ...storageStatus,
            postsProcessed: processed.length,
            totalSizeBytes: totalSize,
            truncationWarnings,
            originalPostCount: blogs.length
        }
    };
};

// to save blog data in the local storage
const saveBlogDataToLocalStorage = (posts) => {
    console.log('Attempting to save blogs to localStorage:', { postCount: posts.length });
    
    const storageStatus = checkStorageQuota();
    console.log('Storage status:', storageStatus);
    
    if (!storageStatus.available) {
        console.warn('Storage not available:', storageStatus.message);
        return {
            success: false,
            storageInfo: storageStatus
        };
    }

    try {
        // First try to save with data reduction
        const { blogs: simplifiedPosts, storageInfo } = prepareBlogsForStorage(posts);
        console.log('Prepared posts for storage:', { 
            originalCount: posts.length,
            processedCount: simplifiedPosts.length,
            storageInfo 
        });
        
        // Log any truncation warnings
        if (storageInfo.truncationWarnings.length > 0) {
            console.warn(`Content truncated in ${storageInfo.truncationWarnings.length} posts to fit in storage:`, 
                storageInfo.truncationWarnings);
        }
        
        // Check if storage is near capacity
        if (storageInfo.usageData?.isNearingLimit) {
            console.warn(`Storage usage high (${Math.round(storageInfo.usageData.percentUsed * 100)}%). Consider clearing data.`);
        }
        
        // Store the data
        const dataToStore = JSON.stringify(simplifiedPosts);
        console.log('Attempting to store data of size:', dataToStore.length);
        
        // Clear existing data before saving new data
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, dataToStore);
        console.log('Successfully saved to localStorage');
        
        return {
            success: true,
            storageInfo
        };
    } catch (error) {
        console.error('Error saving blog data to local storage:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        // If the first attempt fails, try with more aggressive data reduction
        try {
            console.log('Attempting fallback with more aggressive data reduction');
            const { blogs: reducedPosts, storageInfo } = prepareBlogsForStorage(posts.slice(-5)); // Keep only last 5 posts
            localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedPosts));
            console.warn('Saved only the 5 most recent blog posts due to storage limitations');
            return {
                success: true,
                storageInfo: {
                    ...storageInfo,
                    truncated: true,
                    truncationLevel: 'reduced-to-5'
                }
            };
        } catch (fallbackError) {
            console.error('Could not save any blog data to storage:', fallbackError);
            console.error('Fallback error details:', {
                name: fallbackError.name,
                message: fallbackError.message,
                stack: fallbackError.stack
            });
            
            // Last resort: clear storage and try to save just the latest post
            try {
                console.log('Attempting final fallback: saving only latest post');
                localStorage.clear();
                const { blogs: latestPost, storageInfo } = prepareBlogsForStorage([posts[posts.length - 1]]);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(latestPost));
                console.warn('Storage limitations forced saving only the latest blog post');
                return {
                    success: true,
                    storageInfo: {
                        ...storageInfo,
                        truncated: true,
                        truncationLevel: 'latest-only'
                    }
                };
            } catch (finalError) {
                console.error('All storage attempts failed:', finalError);
                return {
                    success: false,
                    error: finalError.message,
                    storageInfo: {
                        available: false,
                        message: "All storage attempts failed"
                    }
                };
            }
        }
    }
};

export const BlogProvider = ({ children }) => {
    // use the useState hook to manage the state of the blogs array
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [persistenceEnabled, setPersistenceEnabled] = useState(true);
    const [storageInfo, setStorageInfo] = useState(null);

    // Keep track of storage usage
    const updateStorageInfo = useCallback(() => {
        const info = checkStorageQuota();
        setStorageInfo(info);
        return info;
    }, []);

    // function to add a blog
    const addBlog = useCallback((blog) => {
        // Check storage status before adding
        const currentStorage = updateStorageInfo();
        
        // Show warning if storage is nearing capacity
        if (currentStorage.usageData?.isNearingLimit) {
            console.warn(`Storage is ${Math.round(currentStorage.usageData.percentUsed * 100)}% full. Content may be truncated.`);
        }
        
        // Ensure slug is properly set
        const slug = blog.slug ||
            (blog.title ? blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `post-${Date.now()}`);

        // Check content size and show warning if it will be truncated
        const contentResult = limitContentSize(blog.content);
        if (contentResult.truncated) {
            console.warn(`Blog content for "${blog.title}" exceeds size limit (${contentResult.originalSize} chars) and will be truncated to ${contentResult.newSize} chars.`);
        }

        const newBlog = {
            ...blog,
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            slug: slug,
            content: contentResult.content
        };

        console.log('Adding new blog with data:', newBlog);

        setBlogs((prevBlogs) => {
            const updatedBlogs = [...prevBlogs, newBlog];

            // Try to persist, but don't fail if storage is full
            if (persistenceEnabled) {
                const result = saveBlogDataToLocalStorage(updatedBlogs);
                if (!result.success) {
                    setPersistenceEnabled(false);
                }
                
                // Update storage info
                setStorageInfo(result.storageInfo);
                
                // Notify about any truncation
                if (result.storageInfo.truncationWarnings?.length > 0) {
                    console.warn(`${result.storageInfo.truncationWarnings.length} posts were truncated to fit in storage.`);
                }
            }

            return updatedBlogs;
        });
    }, [persistenceEnabled, updateStorageInfo]);

    // function to remove a blog
    const removeBlog = useCallback((id) => {
        setBlogs((prevBlogs) => {
            const updatedBlogs = prevBlogs.filter((blog) => blog.id !== id);

            if (persistenceEnabled) {
                const result = saveBlogDataToLocalStorage(updatedBlogs);
                if (!result.success) {
                    setPersistenceEnabled(false);
                }
                
                // Update storage info
                setStorageInfo(result.storageInfo);
            }

            return updatedBlogs;
        });
    }, [persistenceEnabled]);

    // Function to add a comment to a blog post
    const addComment = useCallback((blogId, commentData) => {
        setBlogs(prevBlogs => {
            // Find the blog post to add the comment to
            const updatedBlogs = prevBlogs.map(blog => {
                if (blog.id.toString() !== blogId.toString()) {
                    return blog;
                }
                
                // Create new comment object with ID and date
                const newComment = {
                    id: Date.now(),
                    author: {
                        name: commentData.author || 'Anonymous'
                    },
                    content: commentData.content,
                    date: new Date().toLocaleDateString(),
                    replies: []
                };
                
                // Add to existing comments or create new array
                // Store all comments instead of just the latest 5
                const updatedComments = blog.comments 
                    ? [newComment, ...blog.comments]
                    : [newComment];
                
                return {
                    ...blog,
                    comments: updatedComments
                };
            });
            
            // Try to persist changes
            if (persistenceEnabled) {
                const result = saveBlogDataToLocalStorage(updatedBlogs);
                if (!result.success) {
                    setPersistenceEnabled(false);
                }
                setStorageInfo(result.storageInfo);
            }
            
            return updatedBlogs;
        });
    }, [persistenceEnabled]);

    // Function to remove a comment from a blog post
    const removeComment = useCallback((blogId, commentId) => {
        setBlogs(prevBlogs => {
            // Find the blog post and remove the comment
            const updatedBlogs = prevBlogs.map(blog => {
                if (blog.id.toString() !== blogId.toString()) {
                    return blog;
                }
                
                // Filter out the comment to be removed
                const updatedComments = blog.comments.filter(
                    comment => comment.id.toString() !== commentId.toString()
                );
                
                return {
                    ...blog,
                    comments: updatedComments
                };
            });
            
            // Try to persist changes
            if (persistenceEnabled) {
                const result = saveBlogDataToLocalStorage(updatedBlogs);
                if (!result.success) {
                    setPersistenceEnabled(false);
                }
                setStorageInfo(result.storageInfo);
            }
            
            return updatedBlogs;
        });
    }, [persistenceEnabled]);

    // Get function to clear all storage if needed
    const clearAllBlogs = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            setBlogs([]);
            updateStorageInfo();
            return true;
        } catch (error) {
            console.error("Failed to clear blogs:", error);
            return false;
        }
    }, [updateStorageInfo]);

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
        persistenceEnabled,
        storageInfo,
        updateStorageInfo,
        clearAllBlogs,
        addComment,
        removeComment,
        setBlogs
    };

    // local storage to persist the data and use the useEffect hook to load the data from local storage
    // to save the data to local storage
    useEffect(() => {
        if (blogs.length > 0 && persistenceEnabled) {
            const result = saveBlogDataToLocalStorage(blogs);
            if (!result.success) {
                setPersistenceEnabled(false);
            }
            setStorageInfo(result.storageInfo);
        }
    }, [blogs, persistenceEnabled]);

    // to load the data from local storage
    useEffect(() => {
        const getBlogDataFromLocalStorage = () => {
            console.log('Attempting to load blogs from localStorage');
            try {
                const savedBlogData = localStorage.getItem(STORAGE_KEY);
                console.log('Raw data from localStorage:', savedBlogData ? 'Data exists' : 'No data found');
                
                if (savedBlogData) {
                    const parsedData = JSON.parse(savedBlogData);
                    console.log('Successfully parsed data:', { 
                        blogCount: parsedData.length,
                        hasComments: parsedData.some(blog => blog.comments?.length > 0)
                    });
                    setBlogs(parsedData);
                }
                
                // Check storage status on load
                const storageStatus = updateStorageInfo();
                console.log('Storage status after load:', storageStatus);
            } catch (error) {
                console.error('Error loading blogs from localStorage:', error);
                console.error('Error details:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
                setPersistenceEnabled(false);
            } finally {
                setLoading(false);
            }
        };

        getBlogDataFromLocalStorage();
    }, [updateStorageInfo]);

    // use the context in the component
    return (
        <BlogContext.Provider value={contextValue}>
            {children}
        </BlogContext.Provider>
    );
};