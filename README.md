# Midnight Blog

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.7-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, responsive blogging platform with a dark-themed aesthetic designed for writers to share their stories, articles, and expertise. The application enhances readability during evening hours, hence the name "Midnight".

![Midnight Blog Screenshot](public/favicon.png)

## ✨ Features

- **Dark-themed UI** with responsive design for all devices
- **Article browsing and reading** with elegant typography
- **Category-based filtering** to easily find content
- **Rich text editing** for content creation with TipTap editor
  - Strict 5,000 character limit with real-time counter
  - Visual warnings at 80% of limit
  - Size estimation in KB
  - Automatic truncation at limit
- **Image handling** with smart validation
  - Maximum size: 1MB
  - Warning at 500KB
  - Support for JPG, PNG, GIF, WebP
  - File upload and URL input options
  - Real-time validation and feedback
- **Social sharing capabilities** for distribution across platforms
- **Newsletter subscription** to keep readers engaged
- **User authentication** with secure sign-up and sign-in
- **Offline capability** through local storage persistence
- **Smooth animations** powered by Framer Motion
- **Storage management** with efficient data handling
  - 5MB total storage limit
  - Warning at 70% capacity
  - Optimized image storage
  - Automatic cleanup of invalid data

## 🚀 Tech Stack

- **React 19.1.0** - UI library for building user interfaces
- **Vite 6.3.5** - Next-generation frontend tooling
- **TailwindCSS 4.1.7** - Utility-first CSS framework
- **React Router DOM 7.6.0** - Client-side routing
- **TipTap 2.12.0** - Headless, extensible rich text editor
- **Framer Motion** - Animation library for React
- **FontAwesome/Heroicons/Lucide** - Icon libraries
- **localStorage/sessionStorage** - Client-side data persistence

## 📚 Documentation

For detailed documentation about the project, architecture, components, and more, please check our comprehensive [DOCUMENTATION.md](DOCUMENTATION.md).

## 🛠️ Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/YourUsername/midnight-blog.git
   cd midnight-blog
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

## 📁 Project Structure

The project follows a component-based architecture with the following structure:

```
midnight-blog/
├── public/                 # Static assets
│   ├── favicon.png         # Site favicon
│   ├── robots.txt          # SEO directives
│   ├── sitemap.xml         # Site structure
│   └── brand-colors.css    # Color variables
│
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Shared components (Navbar, Footer, etc.)
│   │   ├── blog/           # Blog-specific components
│   │   └── auth/           # Authentication components
│   │
│   ├── pages/              # Page components (route destinations)
│   ├── context/            # React Context providers
│   ├── App.jsx             # Main app component
│   ├── BrowserRouter.jsx   # Router configuration
│   └── main.jsx            # Application entry point
```

## 🚧 Current Status

Midnight Blog is currently implemented as a frontend-only application that simulates backend functionality through client-side storage mechanisms. It uses browser storage APIs (localStorage/sessionStorage) to persist data across sessions.

### Roadmap

- [ ] Add user profile customization
- [ ] Implement dark/light theme toggle
- [ ] Integrate with a real backend API
- [ ] Add comment moderation features
- [ ] Implement search functionality

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See the [contributing guidelines](DOCUMENTATION.md#contributing) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [TipTap](https://tiptap.dev/) - Rich text editor
- [Framer Motion](https://www.framer.com/motion/) - Animation library
