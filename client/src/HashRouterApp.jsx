import React, { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { BlogProvider } from './context/BlogContext';


// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blogs = lazy(() => import('./pages/Blogs'));
const StartWriting = lazy(() => import('./pages/StartWriting'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const SignupForm = lazy(() => import('./components/auth/SignupForm'));
const SigninForm = lazy(() => import('./components/auth/SigninForm'));
const BlogDetailsPage = lazy(() => import('./pages/BlogDetailsPage'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

/**
 * Router using HashRouter for environments supporting HTML5 history API
 */
const HashRouterApp = () => {
    return (
        <HashRouter>
            <BlogProvider>
                <div className="min-h-screen bg-gradient-to-t from-[#000000] to-[#1f2937] text-gray-300">
                        <Navbar />
                        <Suspense fallback={<LoadingSpinner />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/blogs" element={<Blogs />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/start-writing" element={<StartWriting />} />
                                <Route
                                    path="*"
                                    element={<ErrorPage errorCode="404" errorMessage="Page Not Found" />}
                                />
                                <Route path="/signup" element={<SigninForm />} />
                                <Route path="/signin" element={<SignupForm />} />
                                <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
                            </Routes>
                        </Suspense>
                        <Footer />
                    </div>
            </BlogProvider>
        </HashRouter>
    );
};

export default HashRouterApp;