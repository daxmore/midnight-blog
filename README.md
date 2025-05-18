# Midnight Blog

A modern, responsive blogging platform with a dark-themed aesthetic designed for writers to share their stories, articles, and expertise. The application enhances readability during evening hours, hence the name "Midnight".

## Features

- Dark-themed UI with responsive design for all devices
- Article browsing and reading
- Category-based filtering
- Rich text editing for content creation
- Social sharing capabilities
- Newsletter subscription

## Tech Stack

- React 19.1.0
- Vite 6.3.5
- TailwindCSS 4.1.7
- React Router DOM 7.6.0
- TipTap 2.12.0 for rich text editing
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/YourUsername/midnight-blog.git
   cd midnight-blog
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Build for production
   ```
   npm run build
   ```

## Project Structure

The project follows a component-based architecture with the following structure:

```
src/
├── components/       # Reusable UI components
│   ├── common/       # Shared components (Navbar, Footer, etc.)
│   ├── blog/         # Blog-specific components
│   └── auth/         # Authentication components
│
├── pages/            # Page components (route destinations)
├── context/          # React Context providers
├── App.jsx           # Main app component
├── BrowserRouter.jsx # Router configuration
└── main.jsx          # Application entry point
```

## Current Status

Midnight Blog is currently implemented as a frontend-only application that simulates backend functionality through client-side storage mechanisms. It uses browser storage APIs (localStorage/sessionStorage) to persist data across sessions.

## License

[MIT](LICENSE)
