# Midnight Blog Context API Documentation

This document provides an explanation of the context file used in the Midnight Blog application. The application uses React's Context API for state management, with one main context provider: `BlogContext`.

## Table of Contents

- [Midnight Blog Context API Documentation](#midnight-blog-context-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [BlogContext](#blogcontext)
    - [Overview](#overview)
    - [Context Creation](#context-creation)
    - [Core Functions](#core-functions)
    - [Context Provider Implementation](#context-provider-implementation)
    - [State Management](#state-management)
    - [Effect Hooks](#effect-hooks)
    - [Usage Examples](#usage-examples)

---

## BlogContext

### Overview

`BlogContext.jsx` implements a state management system for blog posts using React's Context API. It provides a solution for managing blog data with features for creating, reading, updating, and deleting blog posts.

The context is designed to handle the following key aspects:
- **Data Persistence**: Stores blog data in the browser's localStorage.
- **Content Management**: Handles blog posts with validation.

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

### Core Functions

The context provides these main functions for blog management:

**`addBlog(blog)`**
- **Purpose**: Adds a new blog post.
- **Implementation**:
  - Ensures a slug is properly set.
  - Creates a new blog object with an ID and date.
  - Updates state and persists to localStorage.

**`removeBlog(id)`**
- **Purpose**: Removes a blog post by ID.
- **Implementation**:
  - Filters out the blog with the specified ID.
  - Updates state and persists to localStorage.

**`getBlogById(identifier)`**
- **Purpose**: Retrieves a blog by ID or slug.
- **Implementation**:
  - Handles both numeric IDs and string slugs.
  - Searches the blogs array for a matching ID or slug.

### Context Provider Implementation

The `BlogProvider` component serves as the container for all blog-related state and functionality:

```jsx
export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load blogs from localStorage on initial render
    useEffect(() => {
        // ...
    }, []);

    // Store blogs in localStorage whenever they change
    useEffect(() => {
        // ...
    }, [blogs, loading]);

    // Function implementations...

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
```

### State Management

The BlogProvider manages several pieces of state:

| State     | Type    | Purpose                                         |
| --------- | ------- | ----------------------------------------------- |
| `blogs`   | Array   | Stores all blog posts.                          |
| `loading` | Boolean | Indicates if data is being loaded from storage. |

### Effect Hooks

The provider uses two main effect hooks:

1. **Initial Data Loading**:
   - Runs once on component mount.
   - Loads blog data from localStorage.
   - Sets the loading state to false when complete.

2. **Data Persistence**:
   - Runs whenever `blogs` or `loading` changes.
   - Saves blog data to localStorage.

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
```