# Midnight Blog Context API Documentation

This document provides a comprehensive and detailed explanation of the context files used in the Midnight Blog application. The application uses React's Context API for state management, with two main context providers: `BlogContext` and `DeleteCommentContext`.

## Table of Contents

- [Midnight Blog Context API Documentation](#midnight-blog-context-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [BlogContext](#blogcontext)
    - [Overview](#overview)
    - [Context Creation](#context-creation)
    - [Constants](#constants)
    - [Helper Functions](#helper-functions)
      - [Storage Management](#storage-management)
      - [Content Management](#content-management)
      - [Data Compression](#data-compression)
    - [Core Functions](#core-functions)
    - [Context Provider Implementation](#context-provider-implementation)
    - [State Management](#state-management)
    - [Effect Hooks](#effect-hooks)
    - [Usage Examples](#usage-examples)
  - [DeleteCommentContext](#deletecommentcontext)
    - [Overview](#overview-1)
    - [Context Creation](#context-creation-1)
    - [State Management](#state-management-1)
    - [Error Handling](#error-handling)
    - [Core Functions](#core-functions-1)
    - [Integration with BlogContext](#integration-with-blogcontext)
    - [Context Provider Implementation](#context-provider-implementation-1)
    - [Usage Examples](#usage-examples-1)
    - [Workflow Diagram](#workflow-diagram)

---

## BlogContext

### Overview

`BlogContext.jsx` implements a sophisticated state management system for blog posts using React's Context API. It provides a complete solution for managing blog data with features for storage optimization, content management, and comment handling.

The context is designed to handle the following key aspects:
- **Data Persistence**: Stores blog data in the browser's localStorage with compression
- **Storage Optimization**: Monitors storage usage and implements fallback strategies
- **Content Management**: Handles blog posts with validation and size limitations
- **Comment System**: Provides functionality for adding and removing comments
- **Error Handling**: Gracefully handles storage limitations and errors
- **Performance Optimization**: Uses compression techniques to maximize storage efficiency

### Context Creation

The context is created using React's `createContext` function:

```jsx
export const BlogContext = createContext();
```

A custom hook `useBlog` is provided for easier consumption of the context:

```jsx
export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
}
```

This hook includes error checking to ensure it's used within the appropriate provider.

### Constants

The file defines several constants to manage storage limitations and content restrictions:

| Constant | Value | Description |
|----------|-------|-------------|
| `STORAGE_KEY` | 'blogs' | Key used for localStorage to store blog data |
| `MAX_CONTENT_SIZE` | 5000 | Maximum characters allowed for blog content |
| `MAX_STORAGE_SIZE` | 1MB (1,048,576 bytes) | Maximum localStorage size allocation |
| `WARNING_THRESHOLD` | 0.8 (80%) | Threshold percentage for storage warning |
| `MAX_COMMENTS_PER_POST` | 5 | Maximum number of comments allowed per blog post |
| `MAX_COMMENT_LENGTH` | 500 | Maximum characters allowed per comment |
| `MAX_REPLIES_PER_COMMENT` | 2 | Maximum number of replies allowed per comment |
| `MAX_BLOGS_TO_STORE` | 10 | Maximum number of blog posts to keep in storage |
| `MAX_IMAGE_SIZE` | 1MB (1,048,576 bytes) | Maximum size for image data |
| `IMAGE_WARNING_SIZE` | 500KB (512,000 bytes) | Threshold for image size warning |

These constants are crucial for:
- Preventing excessive storage usage
- Maintaining performance by limiting data size
- Providing appropriate user feedback
- Implementing graceful degradation when limits are reached

### Helper Functions

The context includes numerous helper functions organized into categories:

#### Storage Management

**`getStorageUsage()`**
- **Purpose**: Calculates the current localStorage usage
- **Implementation**: 
  - Retrieves blog data from localStorage
  - Calculates size in bytes (accounting for Unicode characters)
  - Returns total bytes used, percentage of limit used, and warning flag
- **Error Handling**: Returns zeros if storage access fails
- **Usage**: Used to monitor storage limits and provide warnings

```jsx
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
```

**`checkStorageQuota()`**
- **Purpose**: Checks if localStorage is available and its current usage
- **Implementation**:
  - Verifies localStorage availability
  - Uses `getStorageUsage()` to get current usage
  - Returns availability status and formatted message
- **Error Handling**: Returns error message if localStorage is unavailable
- **Usage**: Used before storage operations to check if they can proceed

**`formatBytes(bytes, decimals = 2)`**
- **Purpose**: Formats byte sizes to human-readable format (KB, MB, GB)
- **Implementation**: 
  - Converts raw byte count to appropriate unit (Bytes, KB, MB, GB)
  - Formats with specified decimal precision
- **Usage**: Used in user-facing messages about storage usage

#### Content Management

**`limitContentSize(content, maxSize = MAX_CONTENT_SIZE)`**
- **Purpose**: Truncates content to a safe size while preserving readability
- **Implementation**:
  - Checks if content exceeds maximum size
  - Finds appropriate cutoff point (end of sentence or paragraph)
  - Truncates content at that point
  - Returns truncation metadata along with the content
- **Smart Truncation**: Attempts to cut at natural breakpoints like periods or paragraph ends
- **Usage**: Used when adding or updating blog content

```jsx
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
```

**`estimateBlogSize(blog)`**
- **Purpose**: Estimates the size of a blog post in bytes
- **Implementation**:
  - Primary method: JSON stringify and measure length
  - Fallback method: Field-by-field size estimation
- **Error Handling**: Falls back to manual estimation if JSON stringify fails
- **Usage**: Used to predict storage requirements before saving

**`isValidImageUrl(url)`**
- **Purpose**: Validates if a URL points to a supported image format
- **Implementation**:
  - Parses URL and extracts file extension
  - Checks against list of valid image extensions (jpg, jpeg, png, gif, webp)
- **Error Handling**: Returns false for invalid URLs
- **Usage**: Used to validate image URLs before storing them

**`processImage(imageUrl, imageFile = null)`**
- **Purpose**: Handles image data processing and validation
- **Implementation**:
  - Supports both URL and file/base64 image data
  - Validates image URLs
  - Checks image size against limits
  - Provides appropriate warnings for large images
- **Size Checking**: Warns or rejects images based on size thresholds
- **Usage**: Used when adding or updating blog posts with images

```jsx
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
```

#### Data Compression

**`compressBlogData(post)`**
- **Purpose**: Compresses blog data for efficient storage
- **Implementation**:
  - Truncates content if it exceeds maximum size
  - Processes image data
  - Uses shortened property names (t for title, c for content, etc.)
  - Limits comment count and size
- **Optimization**: Reduces data size while preserving essential information
- **Usage**: Used before storing blog data in localStorage

```jsx
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
```

**`decompressBlogData(compressed)`**
- **Purpose**: Decompresses blog data for use in the application
- **Implementation**:
  - Converts shortened property names back to full names
  - Reconstructs the full blog object structure
- **Usage**: Used when retrieving blog data from localStorage

**`manageStorage(posts)`**
- **Purpose**: Manages storage of blog posts with fallback strategies
- **Implementation**:
  - Sorts posts by date (newest first)
  - Limits number of posts to `MAX_BLOGS_TO_STORE`
  - Compresses data before storage
  - Implements fallback strategies if storage fails
- **Fallback Strategy**: If storage fails, tries storing fewer posts
- **Error Handling**: Attempts multiple strategies before giving up
- **Usage**: Used to optimize storage usage and handle storage limitations

```jsx
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
```

**`saveBlogDataToLocalStorage(posts)`**
- **Purpose**: Saves blog data to localStorage using the management system
- **Implementation**:
  - Calls `manageStorage()` to handle the storage process
  - Logs success or failure information
- **Error Handling**: Logs warnings if storage fails
- **Usage**: Used whenever blog data needs to be persisted

**`getStorageStatus()`**
- **Purpose**: Gets the current storage status
- **Implementation**: Calls `checkStorageQuota()` and returns the result
- **Error Handling**: Returns error status if check fails
- **Usage**: Used to update UI with storage information

### Core Functions

The context provides these main functions for blog management:

**`addBlog(blog)`**
- **Purpose**: Adds a new blog post with proper validation
- **Implementation**:
  - Checks storage status before adding
  - Ensures slug is properly set
  - Limits content size if necessary
  - Creates a new blog object with ID, date, and empty comments
  - Updates state and persists to localStorage
- **Validation**: Checks content size and truncates if needed
- **Error Handling**: Logs warnings if content is truncated
- **Usage**: Used when creating a new blog post

```jsx
const addBlog = useCallback((blog) => {
    // Check storage status before adding
    const currentStorage = updateStorageInfo();

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
```

**`removeBlog(id)`**
- **Purpose**: Removes a blog post by ID
- **Implementation**:
  - Filters out the blog with the specified ID
  - Updates state and persists to localStorage
- **Error Handling**: Disables persistence if storage fails
- **Usage**: Used when deleting a blog post

**`addComment(blogId, commentData)`**
- **Purpose**: Adds a comment to a specific blog post
- **Implementation**:
  - Finds the blog post by ID
  - Checks if comment limit is reached
  - Validates comment length
  - Creates a new comment with ID and date
  - Updates the blog post with the new comment
  - Persists changes to localStorage
- **Validation**: Checks comment count and length limits
- **Error Handling**: Throws errors if limits are exceeded
- **Usage**: Used when adding a comment to a blog post

```jsx
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
```

**`removeComment(blogId, commentId)`**
- **Purpose**: Removes a comment from a blog post
- **Implementation**:
  - Finds the blog post by ID
  - Filters out the comment with the specified ID
  - Updates the blog post with the filtered comments
  - Persists changes to localStorage
- **Error Handling**: Disables persistence if storage fails
- **Usage**: Used when deleting a comment from a blog post

**`clearAllBlogs()`**
- **Purpose**: Clears all blog data from storage
- **Implementation**:
  - Removes the blog data from localStorage
  - Resets the blogs state to an empty array
  - Updates storage information
- **Error Handling**: Returns success/failure status
- **Usage**: Used for clearing all data or troubleshooting

**`getBlogById(identifier)`**
- **Purpose**: Retrieves a blog by ID or slug
- **Implementation**:
  - Handles both numeric IDs and string slugs
  - Performs type conversion as needed
  - Searches blogs array for matching ID or slug
- **Flexible Matching**: Matches by ID (numeric or string) or by slug
- **Error Handling**: Logs warning if no blog is found
- **Usage**: Used for retrieving a specific blog post

```jsx
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
```

**`updateStorageInfo()`**
- **Purpose**: Updates storage usage information
- **Implementation**: Calls `getStorageStatus()` and updates state
- **Usage**: Used to refresh storage information after operations

### Context Provider Implementation

The `BlogProvider` component serves as the container for all blog-related state and functionality:

```jsx
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
        // Implementation details...
    }, [updateStorageInfo]);

    // Store blogs in localStorage whenever they change
    useEffect(() => {
        // Implementation details...
    }, [blogs, loading, persistenceEnabled]);

    // Function implementations...

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
```

### State Management

The BlogProvider manages several pieces of state:

| State | Type | Purpose |
|-------|------|---------|
| `blogs` | Array | Stores all blog posts with their comments |
| `loading` | Boolean | Indicates if data is being loaded from storage |
| `persistenceEnabled` | Boolean | Tracks if localStorage is available and working |
| `storageInfo` | Object | Contains information about storage usage and limits |

### Effect Hooks

The provider uses two main effect hooks:

1. **Initial Data Loading**:
   - Runs once on component mount
   - Loads blog data from localStorage
   - Parses and decompresses the data
   - Updates storage information
   - Sets loading state to false when complete

2. **Data Persistence**:
   - Runs whenever blogs, loading, or persistenceEnabled changes
   - Saves blog data to localStorage if conditions are met
   - Updates storage information
   - Disables persistence if storage fails

### Usage Examples

To use the BlogContext in a component:

```jsx
import { useBlog } from './context/BlogContext';

// Example 1: Displaying a list of blogs
function BlogList() {
  const { blogs, loading } = useBlog();
  
  if (loading) return <p>Loading blogs...</p>;
  
  return (
    <div>
      <h1>Blog Posts</h1>
      {blogs.length === 0 ? (
        <p>No blog posts yet.</p>
      ) : (
        <ul>
          {blogs.map(blog => (
            <li key={blog.id}>
              <h2>{blog.title}</h2>
              <p>{blog.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Example 2: Creating a new blog post
function CreateBlog() {
  const { addBlog } = useBlog();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    addBlog({
      title,
      content,
      excerpt: content.substring(0, 100) + '...'
    });
    setTitle('');
    setContent('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Blog title" 
      />
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="Blog content" 
      />
      <button type="submit">Create Blog</button>
    </form>
  );
}

// Example 3: Adding a comment to a blog
function CommentForm({ blogId }) {
  const { addComment } = useBlog();
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      addComment(blogId, { author, content });
      setAuthor('');
      setContent('');
    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={author} 
        onChange={(e) => setAuthor(e.target.value)} 
        placeholder="Your name" 
      />
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="Your comment" 
      />
      <button type="submit">Add Comment</button>
    </form>
  );
}
```

---

## DeleteCommentContext

### Overview

`DeleteCommentContext.jsx` provides a specialized context for managing the comment deletion process in the Midnight Blog application. It creates a separate workflow for comment deletion with confirmation steps, loading states, and error handling.

This context is designed to:
- Separate the deletion UI flow from the actual data operation
- Provide a consistent deletion experience across the application
- Handle loading states during deletion
- Provide error and success feedback
- Integrate with the main BlogContext for the actual data operations

### Context Creation

The context is created using React's `createContext` function:

```jsx
const DeleteCommentContext = createContext();
```

A custom hook `useDeleteComment` is provided for easier consumption of the context:

```jsx
export const useDeleteComment = () => {
  const context = useContext(DeleteCommentContext);
  if (!context) {
    throw new Error('useDeleteComment must be used within a DeleteCommentProvider');
  }
  return context;
};
```

This hook includes error checking to ensure it's used within the appropriate provider.

### State Management

The context manages several pieces of state to track the deletion process:

| State | Type | Description |
|-------|------|-------------|
| `isDeletingComment` | Boolean | Indicates if deletion is in progress (loading state) |
| `commentToDelete` | Object | Stores the blog ID and comment ID to delete |
| `deleteError` | String | Error message if deletion fails |
| `deleteSuccess` | Boolean | Indicates if deletion was successful |

These state variables work together to create a complete deletion workflow:
1. User initiates deletion → `commentToDelete` is set
2. User confirms deletion → `isDeletingComment` becomes true
3. Deletion succeeds → `deleteSuccess` becomes true
4. Deletion fails → `deleteError` contains the error message

### Error Handling

The context implements comprehensive error handling:
- Catches errors during the deletion process
- Stores error messages in state for display
- Provides a clean way to reset errors
- Logs detailed error information to the console

### Core Functions

The context provides these main functions for managing the comment deletion process:

**`prepareDeleteComment(blogId, commentId)`**
- **Purpose**: Sets up a comment for deletion (first step in the process)
- **Implementation**: Stores the blog ID and comment ID in state
- **Usage**: Called when a user clicks a delete button for a comment

```jsx
const prepareDeleteComment = (blogId, commentId) => {
  setCommentToDelete({ blogId, commentId });
};
```

**`cancelDeleteComment()`**
- **Purpose**: Cancels the deletion process
- **Implementation**: Resets the commentToDelete and error states
- **Usage**: Called when a user cancels a deletion confirmation

```jsx
const cancelDeleteComment = () => {
  setCommentToDelete(null);
  setDeleteError('');
};
```

**`deleteComment()`**
- **Purpose**: Executes the comment deletion (after confirmation)
- **Implementation**:
  - Sets loading state
  - Extracts blog ID and comment ID from state
  - Calls the removeComment function from BlogContext
  - Sets success state on completion
  - Resets state after a timeout
  - Handles errors if deletion fails
- **Async Operation**: Uses async/await pattern for clean error handling
- **Error Handling**: Catches and stores any errors that occur
- **Usage**: Called when a user confirms deletion

```jsx
const deleteComment = async () => {
  if (!commentToDelete) return;
  
  setIsDeletingComment(true);
  setDeleteError('');
  setDeleteSuccess(false);
  
  try {
    const { blogId, commentId } = commentToDelete;
    
    // Use the removeComment function from BlogContext
    removeComment(blogId, commentId);
    
    // Show success message
    setDeleteSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setDeleteSuccess(false);
    }, 3000);
    
    // Reset commentToDelete
    setCommentToDelete(null);
  } catch (error) {
    console.error('Error deleting comment:', error);
    setDeleteError('Failed to delete comment. Please try again.');
  } finally {
    setIsDeletingComment(false);
  }
};
```

### Integration with BlogContext

The DeleteCommentContext integrates with the BlogContext to perform the actual deletion:

```jsx
// Get removeComment function from BlogContext
let blogContext = { removeComment: () => {} };
try {
  blogContext = useBlog();
} catch (error) {
  console.warn('BlogContext not available, delete functionality will be limited');
}

const { removeComment } = blogContext;
```

Key aspects of this integration:
- Uses the `useBlog` hook to access the BlogContext
- Provides a fallback if BlogContext is not available
- Extracts the `removeComment` function for use in the deletion process
- Handles errors gracefully if BlogContext is not accessible

### Context Provider Implementation

The `DeleteCommentProvider` component serves as the container for all deletion-related state and functionality:

```jsx
export const DeleteCommentProvider = ({ children }) => {
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Get removeComment function from BlogContext
  let blogContext = { removeComment: () => {} };
  try {
    blogContext = useBlog();
  } catch (error) {
    console.warn('BlogContext not available, delete functionality will be limited');
  }
  
  const { removeComment } = blogContext;
  
  // Function implementations...
  
  // Context value to be provided
  const contextValue = {
    isDeletingComment,
    commentToDelete,
    deleteError,
    deleteSuccess,
    prepareDeleteComment,
    cancelDeleteComment,
    deleteComment
  };
  
  return (
    <DeleteCommentContext.Provider value={contextValue}>
      {children}
    </DeleteCommentContext.Provider>
  );
};
```

### Usage Examples

To use the DeleteCommentContext in a component:

```jsx
import { useDeleteComment } from './context/DeleteCommentContext';

// Example 1: Basic comment deletion with confirmation
function CommentItem({ blogId, comment }) {
  const { 
    prepareDeleteComment, 
    commentToDelete, 
    deleteComment, 
    cancelDeleteComment,
    isDeletingComment,
    deleteError
  } = useDeleteComment();
  
  const isThisCommentBeingDeleted = 
    commentToDelete && 
    commentToDelete.blogId === blogId && 
    commentToDelete.commentId === comment.id;
  
  return (
    <div className="comment">
      <p>{comment.content}</p>
      <div className="comment-footer">
        <span>By {comment.author.name} on {comment.date}</span>
        
        {!isThisCommentBeingDeleted ? (
          <button onClick={() => prepareDeleteComment(blogId, comment.id)}>
            Delete
          </button>
        ) : (
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this comment?</p>
            <button 
              onClick={deleteComment} 
              disabled={isDeletingComment}
            >
              {isDeletingComment ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button 
              onClick={cancelDeleteComment}
              disabled={isDeletingComment}
            >
              Cancel
            </button>
            {deleteError && <p className="error">{deleteError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// Example 2: Using a modal for deletion confirmation
function CommentList({ blogId, comments }) {
  const { 
    prepareDeleteComment, 
    commentToDelete, 
    deleteComment, 
    cancelDeleteComment,
    isDeletingComment,
    deleteError,
    deleteSuccess
  } = useDeleteComment();
  
  return (
    <div>
      <h3>Comments</h3>
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <p>{comment.content}</p>
          <button onClick={() => prepareDeleteComment(blogId, comment.id)}>
            Delete
          </button>
        </div>
      ))}
      
      {/* Modal for deletion confirmation */}
      {commentToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete this comment?</p>
            
            <div className="modal-actions">
              <button 
                onClick={deleteComment} 
                disabled={isDeletingComment}
              >
                {isDeletingComment ? 'Deleting...' : 'Delete'}
              </button>
              <button 
                onClick={cancelDeleteComment}
                disabled={isDeletingComment}
              >
                Cancel
              </button>
            </div>
            
            {deleteError && (
              <div className="error-message">{deleteError}</div>
            )}
            
            {deleteSuccess && (
              <div className="success-message">Comment deleted successfully!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Workflow Diagram

The DeleteCommentContext implements the following workflow:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Initial State  │────▶│  Prepared for   │────▶│  Deleting       │
│                 │     │  Deletion       │     │  (Loading)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                         │
                               │                         │
                               ▼                         ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │  Cancelled      │     │  Success/Error  │
                        │  (Back to       │     │  State          │
                        │   Initial)      │     │                 │
                        └─────────────────┘     └─────────────────┘
                                                        │
                                                        │
                                                        ▼
                                                ┌─────────────────┐
                                                │  Reset to       │
                                                │  Initial State  │
                                                │  (after delay)  │
                                                └─────────────────┘
```

This workflow ensures a consistent and user-friendly deletion experience with proper feedback at each step.