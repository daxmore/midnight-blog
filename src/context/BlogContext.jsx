// import all the necessary libraries like { createContext, useContext, useState } 
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

//  create a context for the blog
export const BlogContext = createContext();

// Constants for storage
const STORAGE_KEY = 'blogs';
const MAX_CONTENT_SIZE = 5000;
const MAX_STORAGE_SIZE = 1 * 1024 * 1024; // 1MB
const WARNING_THRESHOLD = 0.8;
const MAX_COMMENTS_PER_POST = 5;
const MAX_COMMENT_LENGTH = 500;
const MAX_REPLIES_PER_COMMENT = 2;
const MAX_BLOGS_TO_STORE = 10;
const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB max for image data
const IMAGE_WARNING_SIZE = 500 * 1024; // 500KB warning threshold

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
        const blogsData = localStorage.getItem(STORAGE_KEY);
        const totalSize = blogsData ? blogsData.length * 2 : 0; // Unicode characters can use up to 2 bytes

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
        if (!window.localStorage) {
            return {
                available: false,
                message: "localStorage is not available in this browser"
            };
        }

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
    if (!content) return {
        truncated: false,
        originalSize: 0,
        newSize: 0,
        content: ''
    };

    const originalSize = content.length;
    let newContent = content;
    let truncated = false;

    if (typeof content === 'string' && content.length > maxSize) {
        // Find the last complete sentence or paragraph before the limit
        const lastPeriod = content.slice(0, maxSize).lastIndexOf('.');
        const lastParagraph = content.slice(0, maxSize).lastIndexOf('</p>');
        const cutoffPoint = Math.max(lastPeriod, lastParagraph);

        if (cutoffPoint > 0) {
            newContent = content.slice(0, cutoffPoint + 1);
            if (lastParagraph > 0) {
                newContent += '</p>';
            }
        } else {
            // If no good cutoff point found, just truncate at maxSize
            newContent = content.slice(0, maxSize) + '...';
        }

        truncated = true;
    }

    return {
        truncated,
        originalSize,
        newSize: newContent.length,
        content: newContent
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

// Function to format bytes to human readable format
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Function to validate image URL
const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
        const parsedUrl = new URL(url);
        const extension = parsedUrl.pathname.split('.').pop().toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        return validExtensions.includes(extension);
    } catch {
        return false;
    }
};

// Function to handle image data
const processImage = (imageUrl, imageFile = null) => {
    if (!imageUrl && !imageFile) return {
        url: '',
        size: 0,
        warning: null,
        type: 'none'
    };

    // If it's a direct URL
    if (imageUrl && !imageUrl.startsWith('data:image')) {
        if (!isValidImageUrl(imageUrl)) {
            return {
                url: '',
                size: 0,
                warning: 'Invalid image URL. Please provide a valid image URL (jpg, jpeg, png, gif, or webp).',
                type: 'url'
            };
        }
        return {
            url: imageUrl,
            size: 0,
            warning: null,
            type: 'url'
        };
    }

    // If it's a base64 image or file
    const imageData = imageFile || imageUrl;
    if (imageData) {
        const size = imageFile ? imageFile.size : Math.ceil((imageData.length * 3) / 4);

        if (size > MAX_IMAGE_SIZE) {
            return {
                url: '/images/placeholder.jpg',
                size: size,
                warning: `Image size (${formatBytes(size)}) exceeds maximum limit of ${formatBytes(MAX_IMAGE_SIZE)}. Please use a smaller image or provide an image URL.`,
                type: 'file'
            };
        }

        if (size > IMAGE_WARNING_SIZE) {
            return {
                url: imageFile ? URL.createObjectURL(imageFile) : imageData,
                size: size,
                warning: `Large image detected (${formatBytes(size)}). Consider using a smaller image or providing an image URL for better performance.`,
                type: 'file'
            };
        }

        return {
            url: imageFile ? URL.createObjectURL(imageFile) : imageData,
            size: size,
            warning: null,
            type: 'file'
        };
    }

    return {
        url: '',
        size: 0,
        warning: null,
        type: 'none'
    };
};

// Function to compress blog data
const compressBlogData = (post) => {
    // Process and compress the content
    const content = post.content || '';
    const compressedContent = content.length > MAX_CONTENT_SIZE
        ? content.slice(0, MAX_CONTENT_SIZE) + '...'
        : content;

    // Process image
    const imageData = processImage(post.image, post.imageFile);

    return {
        id: post.id,
        t: (post.title || '').slice(0, 100),
        c: compressedContent,
        e: (post.excerpt || '').slice(0, 200),
        i: imageData.url,
        d: post.date,
        cat: post.category,
        s: post.slug,
        cm: (post.comments || []).slice(0, MAX_COMMENTS_PER_POST).map(comment => ({
            id: comment.id,
            a: comment.author?.name || 'Anonymous',
            c: (comment.content || '').slice(0, MAX_COMMENT_LENGTH),
            d: comment.date
        })),
        imgWarning: imageData.warning,
        imgType: imageData.type
    };
};

// Function to decompress blog data
const decompressBlogData = (compressed) => ({
    id: compressed.id,
    title: compressed.t,
    content: compressed.c,
    excerpt: compressed.e,
    image: compressed.i,
    date: compressed.d,
    category: compressed.cat,
    slug: compressed.s,
    comments: compressed.cm?.map(comment => ({
        id: comment.id,
        author: { name: comment.a },
        content: comment.c,
        date: comment.d
    })) || [],
    imageWarning: compressed.imgWarning,
    imageType: compressed.imgType
});

// Function to manage storage
const manageStorage = (posts) => {
    try {
        // Clear existing storage first
        localStorage.removeItem(STORAGE_KEY);

        // Sort posts by date (newest first)
        const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Keep only the most recent posts up to MAX_BLOGS_TO_STORE
        const postsToKeep = sortedPosts.slice(0, MAX_BLOGS_TO_STORE);

        // Compress the data
        const compressedData = postsToKeep.map(compressBlogData);

        // Try to store the compressed data
        const jsonString = JSON.stringify(compressedData);

        // Check if the data is too large
        if (jsonString.length * 2 > MAX_STORAGE_SIZE) {
            // If too large, try storing fewer posts
            const minimalPosts = postsToKeep.slice(0, Math.floor(MAX_BLOGS_TO_STORE / 2));
            const minimalData = minimalPosts.map(compressBlogData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalData));

            return {
                success: true,
                storageInfo: {
                    postsProcessed: minimalPosts.length,
                    totalPosts: posts.length,
                    warning: 'Storage limited to most recent posts'
                }
            };
        }

        // Store the data
        localStorage.setItem(STORAGE_KEY, jsonString);

        return {
            success: true,
            storageInfo: {
                postsProcessed: postsToKeep.length,
                totalPosts: posts.length
            }
        };
    } catch (error) {
        console.error('Error saving blog data:', error);

        // If storage fails, try to store even fewer posts
        try {
            const minimalPosts = posts.slice(0, 2); // Try storing just 2 posts
            const compressedData = minimalPosts.map(compressBlogData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(compressedData));

            return {
                success: true,
                storageInfo: {
                    postsProcessed: minimalPosts.length,
                    totalPosts: posts.length,
                    warning: 'Storage limited to most recent posts'
                }
            };
        } catch (retryError) {
            return {
                success: false,
                error: retryError.message
            };
        }
    }
};

// Modify saveBlogDataToLocalStorage to use the new management system
const saveBlogDataToLocalStorage = (posts) => {
    console.log('Attempting to save blogs to localStorage:', { postCount: posts.length });

    const result = manageStorage(posts);

    if (result.success) {
        console.log('Successfully saved to localStorage:', {
            storedPosts: result.storageInfo.postsProcessed,
            totalPosts: result.storageInfo.totalPosts,
            warning: result.storageInfo.warning
        });
    } else {
        console.warn('Failed to save to localStorage:', result.error);
    }

    return result;
};

// Add function to get storage status
const getStorageStatus = () => {
    try {
        const storageStatus = checkStorageQuota();
        return storageStatus;
    } catch (error) {
        console.error('Error getting storage status:', error);
        return {
            available: false,
            message: 'Error checking storage status'
        };
    }
};

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [persistenceEnabled, setPersistenceEnabled] = useState(true);
    const [storageInfo, setStorageInfo] = useState(null);

    // Update storage info to use new system
    const updateStorageInfo = useCallback(() => {
        const info = getStorageStatus();
        setStorageInfo(info);
        return info;
    }, []);

    // Load blogs from localStorage on initial render
    useEffect(() => {
        const getBlogDataFromLocalStorage = () => {
            console.log('Attempting to load blogs from localStorage');
            try {
                const savedBlogData = localStorage.getItem(STORAGE_KEY);
                console.log('Raw data from localStorage:', savedBlogData ? 'Data exists' : 'No data found');

                if (savedBlogData) {
                    const compressedData = JSON.parse(savedBlogData);
                    const decompressedData = compressedData.map(decompressBlogData);
                    console.log('Successfully parsed data:', {
                        blogCount: decompressedData.length
                    });
                    setBlogs(decompressedData);
                }

                const storageStatus = updateStorageInfo();
                console.log('Storage status after load:', storageStatus);
            } catch (error) {
                console.error('Error loading blogs from localStorage:', error);
                setPersistenceEnabled(false);
            } finally {
                setLoading(false);
            }
        };

        getBlogDataFromLocalStorage();
    }, [updateStorageInfo]);

    // Store blogs in localStorage whenever they change
    useEffect(() => {
        if (!loading && persistenceEnabled && blogs.length > 0) {
            const result = saveBlogDataToLocalStorage(blogs);
            if (!result.success) {
                setPersistenceEnabled(false);
            }
            setStorageInfo(result.storageInfo);
        }
    }, [blogs, loading, persistenceEnabled]);

    // function to add a blog
    const addBlog = useCallback((blog) => {
        // Check storage status before adding
        const currentStorage = updateStorageInfo();

        // Show warning if storage is nearing capacity
        if (currentStorage.usageData?.isNearingLimit) {
            throw new Error('Storage is nearly full. Please clear some space before adding new posts.');
        }

        // Ensure slug is properly set
        const slug = blog.slug ||
            (blog.title ? blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `post-${Date.now()}`);

        // Check content size and truncate if necessary
        const contentResult = limitContentSize(blog.content);

        const newBlog = {
            ...blog,
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            slug: slug,
            content: contentResult.content,
            comments: [] // Initialize empty comments array
        };

        // If content was truncated, show a warning
        if (contentResult.truncated) {
            console.warn(`Blog content was truncated from ${contentResult.originalSize} to ${contentResult.newSize} characters`);
        }

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

                // Check if comment limit is reached
                if (blog.comments && blog.comments.length >= MAX_COMMENTS_PER_POST) {
                    throw new Error(`Maximum comment limit of ${MAX_COMMENTS_PER_POST} reached for this post`);
                }

                // Check comment length
                if (commentData.content.length > MAX_COMMENT_LENGTH) {
                    throw new Error(`Comment exceeds maximum length of ${MAX_COMMENT_LENGTH} characters`);
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

    // use the context in the component
    return (
        <BlogContext.Provider value={contextValue}>
            {children}
        </BlogContext.Provider>
    );
};