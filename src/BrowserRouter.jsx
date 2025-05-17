import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blogs from './pages/Blogs';
import StartWriting from './pages/StartWriting';
import ErrorPage from './pages/ErrorPage';
import SignupForm from './components/auth/SignupForm';
import SigninForm from './components/auth/SigninForm';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { BlogProvider } from './context/BlogContext';
import BlogDetailsPage from './pages/BlogDetailsPage';

/**
 * Router using BrowserRouter for environments supporting HTML5 history API
 */
const BrowserRouterApp = () => {
    return (
        <BrowserRouter>
            <BlogProvider>
                <div className="min-h-screen bg-gradient-to-t from-[#000000] to-[#1f2937] text-gray-300">
                    <Navbar />
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
                    <Footer />
                </div>
            </BlogProvider>
        </BrowserRouter>
    );
};

export default BrowserRouterApp;