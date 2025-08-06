# Midnight Blog - Developer Documentation

![Midnight Blog](public/favicon.png)

## Table of Contents

- [Introduction](#introduction)
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Installation and Setup](#installation-and-setup)
- [Project Structure](#project-structure)
- [Component Documentation](#component-documentation)
- [State Management](#state-management)
- [Routing](#routing)
- [Styling](#styling)
- [Rich Text Editor](#rich-text-editor)
- [Data Storage](#data-storage)
- [Performance Considerations](#performance-considerations)
- [Deployment Guide](#deployment-guide)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Writing and Publishing](#writing-and-publishing)

## Introduction

Midnight Blog is a modern, dark-themed blogging platform built with React. It provides a responsive, aesthetically pleasing environment for writers to share their stories and expertise. The dark theme enhances readability during evening hours, which inspired the name "Midnight Blog."

This documentation serves as a comprehensive guide for developers working on the Midnight Blog project, covering everything from setup to architecture decisions and component usage.

## Project Overview

### Core Features

- **Article Management**: Browse, read, create, and update blog posts
- **Category System**: Filter content by categories
- **User Authentication**: Sign-up and sign-in capabilities
- **Rich Text Editor**: Full-featured content creation interface

- **Newsletter Subscription**: User engagement through newsletters
- **Responsive Design**: Optimized for all device sizes

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.0 | UI library |
| Vite | 6.3.5 | Build tooling |
| TailwindCSS | 4.1.7 | Utility-first CSS framework |
| React Router DOM | 7.6.0 | Client-side routing |
| TipTap | 2.12.0 | Rich text editing |
| Framer Motion | 12.12.1 | Animations and transitions |
| Node.js | LTS | Backend runtime |
| Express.js | 5.x | Web framework for Node.js |
| MongoDB | 6.x | NoSQL Database |
| Mongoose | 8.x | MongoDB ODM for Node.js |
| jsonwebtoken | 9.x | JWT for authentication |
| bcryptjs | 2.x | Password hashing |
| cors | 2.x | Cross-Origin Resource Sharing |
| dotenv | 17.x | Environment variable management |

### Design Principles

1. **Dark-first Design**: Optimized for reduced eye strain during night reading
2. **Component Reusability**: Building blocks are designed for reuse across the application
3. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with it
4. **Responsive by Default**: Mobile-first approach to responsive design
5. **Accessibility**: WCAG 2.1 AA compliance is a primary goal

## Architecture

### MERN Stack Implementation

Midnight Blog is implemented as a full-stack application using the MERN (MongoDB, Express.js, React, Node.js) stack. This approach provides:

1.  **Persistent Data Storage**: Data is stored securely in a MongoDB database.
2.  **Robust Backend Logic**: Handles user authentication, data validation, and API endpoints.
3.  **Scalability**: Designed for future expansion and increased user load.
4.  **Industry Standard**: Utilizes widely adopted technologies for modern web development.

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  User Actions   │────▶│  React State    │────▶│  Express.js API │────▶│  MongoDB        │
│                 │     │  Context API    │     │  (Node.js)      │     │                 │
│                 │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                       │                        │                       │
        │                       │                        │                       │
        └───────────────────────┴────────────────────────┴───────────────────────┘
                           Data Fetching & Updates
```

### Component Architecture

The application follows a component-based architecture with:

- **Container Components**: Manage state and data fetching
- **Presentational Components**: Handle rendering and styling
- **Higher-Order Components**: Add cross-cutting functionality
- **Custom Hooks**: Encapsulate reusable logic

## Installation and Setup

### System Requirements

- Node.js (LTS version recommended, 18.x or higher)
- npm (8.x or higher) or yarn (1.22.x or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Local Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/YourUsername/midnight-blog.git
   cd midnight-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

### Environment Configuration

Create a `.env.local` file in the project root for environment-specific variables:

```
VITE_APP_TITLE=Midnight Blog
VITE_APP_DESCRIPTION=Share your stories in the dark
VITE_ANALYTICS_ID=UA-XXXXXXXXX-X  # If using analytics
```

## Project Structure

```
midnight-blog/
├── public/                 # Static assets
│   ├── favicon.png         # Site favicon
│   ├── robots.txt          # SEO directives
│   ├── sitemap.xml         # Site structure
│   ├── brand-colors.css    # Color variables
│   └── icons/              # App icons
│
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Shared components
│   │   ├── blog/           # Blog-specific components
│   │   └── auth/           # Authentication components
│   │
│   ├── pages/              # Page components
│   ├── context/            # React Context providers
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── assets/             # Non-public assets
│   ├── styles/             # Global styles and Tailwind config
│   ├── App.jsx             # Main app component
│   ├── BrowserRouter.jsx   # Router configuration
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
│
├── .eslintrc.js            # ESLint configuration
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── README.md               # Project overview
```

### Key Files Explained

| File | Description |
|------|-------------|
| `src/main.jsx` | Application entry point that initializes React |
| `src/App.jsx` | Root component containing theme providers and router |
| `src/BrowserRouter.jsx` | Defines application routing structure and handles conditional Navbar rendering |
| `public/brand-colors.css` | CSS variables for brand colors |
| `src/context/BlogContext.jsx` | Manages blog data state and API interactions |
| `src/context/AuthContext.jsx` | Manages user authentication state and API interactions |

## Component Documentation

### Core Components

#### `<Navbar />`

The top navigation bar for logged-out users, providing site navigation and user actions.

**Props:**
- `transparent` (boolean): Whether the navbar should have a transparent background

**Usage:**
```jsx
<Navbar transparent={true} />
```

#### `<AfterLoginNav />`

The top navigation bar for logged-in users, providing site navigation, user-specific actions, and a logout button.

**Usage:**
```jsx
<AfterLoginNav />
```

#### `<BlogCard />`

A card component for displaying blog post previews.

**Props:**
- `post` (object): Blog post data
- `compact` (boolean): Whether to show a compact version

**Usage:**
```jsx
<BlogCard post={postData} compact={false} />
```



#### `<RichTextEditor />`

TipTap-based rich text editor for blog content creation.

**Props:**
- `initialContent` (string): Initial HTML content
- `onChange` (function): Callback for content changes
- `placeholder` (string): Placeholder text

**Usage:**
```jsx
<RichTextEditor 
  initialContent="<p>Start writing...</p>"
  onChange={handleContentChange}
  placeholder="What's on your mind?"
  maxLength={5000}
  onLimitReached={handleLimitReached}
/>
```

### Context Providers

#### `<BlogProvider />`

Provides blog data and operations throughout the application.

**Usage:**
```jsx
<BlogProvider>
  <App />
</BlogProvider>
```

#### `<AuthProvider />`

Manages authentication state and user operations.

**Usage:**
```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

## State Management

Midnight Blog uses React Context API for global state management, with key contexts including:

### BlogContext

Manages blog posts, categories, and related operations, interacting with the backend API.

**Provided Values:**
- `blogs` (array): Collection of blog posts fetched from the database.
- `categories` (array): Available categories.
- `loading` (boolean): Loading state for blog data.
- `addBlog(blog)`: Adds a new blog post to the database.
- `updateBlog(id, blog)`: Updates an existing blog post in the database.
- `deleteBlog(id)`: Deletes a blog post from the database.
- `getBlogBySlug(slug)`: Retrieves a blog by URL slug from the fetched data.

### AuthContext

Handles user authentication and profile information, interacting with the backend API.

**Provided Values:**
- `isLoggedIn` (boolean): Authentication status of the user.
- `currentUser` (object): Current authenticated user's data.
- `loading` (boolean): Loading state for authentication status.
- `login(token, userData)`: Signs in a user, stores token, and updates state.
- `register(userData)`: Creates a new user account via API.
- `logout()`: Signs out the current user, clears token, and updates state.
- `updateProfile(data)`: Updates user profile via API.

## Routing

Midnight Blog uses React Router v7 for client-side routing with the following route structure:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `<Home />` | Landing page |
| `/blogs` | `<Blogs />` | Blog listing page |
| `/blogs/:slug` | `<BlogDetailsPage />` | Individual blog post |
| `/about` | `<About />` | About page |
| `/contact` | `<Contact />` | Contact page |
| `/start-writing` | `<StartWriting />` | Blog creation page |
| `/signup` | `<SignupForm />` | User registration |
| `/signin` | `<SigninForm />` | User login |
| `*` | `<ErrorPage />` | 404 page |

### Route Guards

Protected routes require authentication:

```jsx
// Example of a protected route
<Route 
  path="/start-writing" 
  element={
    <ProtectedRoute>
      <StartWriting />
    </ProtectedRoute>
  } 
/>
```

## Styling

### TailwindCSS Configuration

Midnight Blog uses TailwindCSS with a custom configuration to match the dark theme requirements:

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          50: '#f5f5f6',
          100: '#e6e7e9',
          // ... other shades
          900: '#1f2937',
          950: '#0f172a',
        },
        // ... other custom colors
      },
      // ... other theme extensions
    },
  },
  plugins: [
    // ... plugins
  ],
}
```

### Animation System

Framer Motion is used for animations with common motion variants:

```jsx
// Common animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

// Usage
<motion.div
  variants={fadeIn}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

## Rich Text Editor

### Content Limitations

The blog editor implements strict content limitations to ensure reliable storage and optimal performance:

1. **Character Limit**:
   - Maximum content length: 5,000 characters (strictly enforced)
   - Real-time character counting with live counter display
   - Visual feedback at 80% of limit (yellow warning)
   - Automatic truncation at limit
   - Size estimation in KB displayed alongside character count

2. **Image Handling**:
   - Maximum image size: 1MB
   - Warning threshold: 500KB
   - Supported formats: JPG, PNG, GIF, WebP
   - Two upload methods:
     - File upload with size validation
     - Direct image URL input
   - Real-time validation of both file uploads and URLs
   - Clear error messages for invalid images
   - Automatic fallback to placeholder for oversized images

### Editor Features

The TipTap-based rich text editor provides:

1. **Formatting Options**:
   - Bold, italic, and heading styles
   - Bullet and numbered lists
   - Blockquotes
   - Horizontal rules
   - Image insertion

2. **User Interface**:
   - Floating toolbar with formatting options
   - Live character counter
   - Visual feedback for approaching limits
   - Clear error messages
   - Responsive design

3. **Content Validation**:
   - Real-time character counting
   - Automatic truncation at limit
   - HTML sanitization
   - Image size validation
   - Format validation

### Usage Example

```jsx
<RichTextEditor 
  initialContent="<p>Start writing...</p>"
  onChange={handleContentChange}
  placeholder="What's on your mind?"
  maxLength={5000}
  onLimitReached={handleLimitReached}
/>
```

## Data Storage

Midnight Blog now uses a MongoDB database for persistent data storage, accessed via a Node.js/Express.js backend API. This replaces the previous `localStorage` based simulation.

### Backend Data Storage

Data is stored in MongoDB collections:

-   **`blog_data`**: Stores all blog posts.
-   **`auth_data`**: Stores user authentication details.

### Client-Side Data Handling

The frontend interacts with the backend API to perform CRUD operations. `localStorage` is now primarily used only for storing the user's authentication token.

### Error Handling

1.  **API Errors**:
    -   Errors from backend API calls are caught and handled, providing user-friendly messages.
    -   Network errors are specifically identified.
2.  **Validation Errors**:
    -   Backend validation ensures data integrity before saving to the database.
    -   Frontend validation provides immediate feedback to the user.

## Performance Considerations

### Optimization Techniques

1.  **Code Splitting**: Routes are code-split for faster initial load.
2.  **Image Optimization**: Images are lazy-loaded and sized appropriately.
3.  **Memoization**: `React.memo` and `useMemo` for expensive operations.
4.  **Debounced Inputs**: Form inputs use debounce for performance.
5.  **Server-Side Processing**: Heavy data operations are offloaded to the backend.

### Lazy Loading Components

```jsx
// Example of lazy loading a component
const RichTextEditor = React.lazy(() => import('./components/RichTextEditor'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <RichTextEditor />
</Suspense>
```

## Deployment Guide

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```

### Deployment Options

1. **Static Site Hosting**:
   - Netlify
   - Vercel
   - GitHub Pages
   - Cloudflare Pages

2. **Configuration for Netlify**:
   Create a `netlify.toml` file:
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Testing Production Builds

Before deployment, test the production build for:

1. Performance (Lighthouse scores)
2. Cross-browser compatibility
3. Responsive layouts
4. Functionality without developer tools

## Development Workflow

### Recommended VSCode Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

### Code Style and Linting

The project enforces code style via ESLint and EditorConfig:

```bash
# Lint the codebase
npm run lint

# Automatically fix linting issues where possible
npm run lint -- --fix
```

### Commit Guidelines

Follow conventional commits for clear version history:

```
feat: add new blog filtering capability
fix: resolve issue with comment submission
docs: update component documentation
style: format code according to guidelines
refactor: restructure BlogCard component
```

## Contributing

### Getting Started as a Contributor

1. Fork the repository
2. Clone your fork
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Make your changes
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Pull Request Process

1. Ensure your code passes all tests and lint checks
2. Update documentation to reflect your changes
3. Get at least one code review from a maintainer
4. Address any review comments
5. Once approved, a maintainer will merge your PR

## Troubleshooting

### Common Issues

#### "Network Error" or Server Connection Issues
- Ensure your backend server is running (`npx nodemon index.js` in the `server` directory).
- Verify your `MONGO_URI` in `server/.env` is correct and your MongoDB instance is accessible.
- Check your browser's console for more specific network errors.

#### "Cannot find module" errors
- Ensure all dependencies are installed in both `client` and `server` directories (`npm install`).
- Check import paths for typos.
- Restart the development server (both frontend and backend).

#### "Each child in a list should have a unique \"key\" prop."
- This is a React warning. Ensure that when mapping over arrays to render lists of components, each component has a unique `key` prop (e.g., `key={item.id}` or `key={item._id}` if from MongoDB).

#### Styling issues
- Clear browser cache.
- Verify TailwindCSS classes are correct.
- Check for conflicting styles.

### Debugging Tools

1.  **Browser Developer Tools**: For network requests, console logs, and React component inspection.
2.  **Backend Console**: The terminal where your Node.js server is running will show server-side logs and errors.
3.  **MongoDB Client**: Use tools like MongoDB Compass or `mongosh` to directly inspect your database collections and data.


## FAQ

### General Questions

**Q: Can I use Midnight Blog with a real backend?**
A: Yes, the application is designed to be adaptable to a real backend API. See the API integration guide in the advanced documentation.

**Q: How do I customize the theme colors?**
A: Edit the `tailwind.config.js` file to modify the color palette, or use the Theme Provider to add runtime customization.

**Q: Is there a mobile app version?**
A: Not currently, but the web application is fully responsive and works well on mobile browsers.

**Q: How can I contribute to the project?**
A: See the Contributing section for guidelines on how to contribute.

### Technical Questions

**Q: How is authentication handled?**
A: Authentication is handled via a Node.js/Express.js backend using JSON Web Tokens (JWTs). User credentials are sent to the backend, which returns a JWT upon successful login. This token is then stored client-side and sent with subsequent authenticated requests.

**Q: Can I use TypeScript with this project?**
A: Yes, the project can be migrated to TypeScript. A migration guide is planned for future documentation.

**Q: How do I add new pages to the application?**
A: Create a new component in the `pages` directory and add a corresponding route in `HashRouterApp.jsx`.

## Writing and Publishing

### Creating a New Blog Post

1. Click the "Start Writing" button in the navigation bar
2. Fill in the required fields:
   - Title (required)
   - Category (required)
   - Content (required)
   - Featured Image (optional)
3. Use the rich text editor to format your content
4. Preview your post before publishing
5. Click "Publish" to make your post live

### Content Guidelines

1. **Title**:
   - Maximum 100 characters
   - Should be descriptive and engaging
   - No special characters allowed

2. **Content**:
   - Maximum 15,000 characters (≈30KB)
   - Supports rich text formatting
   - Real-time character counter
   - Visual warning at 12,000 characters (80% of limit)
   - Automatic truncation at 15,000 characters

3. **Storage Management**:
   - Warning appears when storage reaches 70% capacity
   - Content size shown in KB
   - Automatic content preservation
   - Clear feedback on storage status

4. **Formatting Options**:
   - Bold, italic, and underline text
   - Headers (H1-H6)
   - Lists (ordered and unordered)
   - Links
   - Images
   - Code blocks
   - Blockquotes

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Documentation last updated: July 2023 