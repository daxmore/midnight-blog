# MongoDB Schemas for Midnight Blog

This document outlines the MongoDB schema structures used in the Midnight Blog application, designed for use with Mongoose.

## 1. Blog Schema (`server/schemaForDB.js`)

This schema defines the structure for individual blog posts, including content, metadata, and author information.

### `AuthorSchema` (Sub-document)

Defines the structure for a blog post author. This is embedded within the `BlogSchema`.

-   **`name`**: `String`, Required. Default: 'Anonymous Author'.
-   **`avatar`**: `String` (URL to the avatar image). Default: 'https://via.placeholder.com/150'.
-   **`bio`**: `String`, MaxLength: 500 characters. Default: 'Information about this author is not available.'.
-   **`socialLinks`**: `Array` of objects.
    -   **`platform`**: `String`, Enum: ['twitter', 'github', 'linkedin'].
    -   **`url`**: `String`.

### `BlogSchema` (Main Document)

-   **`title`**: `String`, Required. Trimmed. MaxLength: 150 characters.
-   **`slug`**: `String`, Required. Unique. Trimmed. Used for URL-friendly identifiers.
-   **`content`**: `String`, Required. Stores HTML content from the rich text editor.
-   **`excerpt`**: `String`, Required. MaxLength: 300 characters. A short summary of the blog post.
-   **`category`**: `String`, Required. Trimmed. Enum: ['Development', 'Design', 'Technology', 'Artificial Intelligence', 'Web Development', 'Machine Learning', 'Uncategorized']. Default: 'Uncategorized'.
-   **`featuredImage`**: `String` (URL or base64 string). Optional.
-   **`author`**: `AuthorSchema` (Embedded sub-document). Default: `{}`.
-   **`readTime`**: `String`. Default: '5 min read'.
-   **`publishedAt`**: `Date`. Default: `Date.now` (automatically set on creation).
-   **`updatedAt`**: `Date`. Default: `Date.now` (automatically updated on modification).

**Indexing for Performance:**
-   `slug`: Indexed for efficient lookup.
-   `category`: Indexed for efficient filtering.
-   `publishedAt`: Indexed for sorting by most recent posts.

**Mongoose Model:** `Blog` (interacts with the `blogs` collection).

## 2. User Schema (`server/authSchema.js`)

This schema defines the structure for user accounts, including authentication credentials and roles.

### `UserSchema`

-   **`username`**: `String`, Required. Unique. Trimmed. MinLength: 3 characters.
-   **`email`**: `String`, Required. Unique. Trimmed. Lowercase. Must match a valid email format.
-   **`password`**: `String`, Required. MinLength: 6 characters. Stored as a hashed value.
-   **`role`**: `String`, Enum: ['user', 'admin']. Default: 'user'.
-   **`createdAt`**: `Date`. Default: `Date.now` (automatically set on creation).

**Pre-save Hook:**
-   Hashes the user's password using `bcryptjs` before saving the document, if the password has been modified.

**Methods:**
-   **`matchPassword(enteredPassword)`**: An asynchronous method to compare a provided password with the stored hashed password using `bcrypt.compare()`.

**Mongoose Model:** `User` (interacts with the `users` collection).
