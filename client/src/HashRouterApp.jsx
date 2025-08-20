import React, { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import AfterLoginNav from './components/common/AfterLoginNav';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Footer from './components/common/Footer';
import AdminRoute from './components/auth/AdminRoute';
import './admin.css';

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

// Lazy load admin components
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const UserList = lazy(() => import('./pages/admin/UserList'));
const BlogList = lazy(() => import('./pages/admin/BlogList'));


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
            <AuthProvider>
                <BlogProvider>
                    <AppContent />
                </BlogProvider>
            </AuthProvider>
        </HashRouter>
    );
};

    const AppContent = () => {
    const { isLoggedIn, currentUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn && currentUser && currentUser.role === 'admin' && !location.pathname.startsWith('/admin')) {
            navigate('/admin/dashboard');
        } else if (isLoggedIn && !currentUser && location.pathname !== '/') {
            // If logged in but no currentUser (e.g., token expired or invalid), navigate to home
            navigate('/');
        }
    }, [isLoggedIn, currentUser, navigate]);

    const renderContent = () => {
        if (currentUser && currentUser.role === 'admin') {
            return (
                <Routes>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<UserList />} />
                        <Route path="blogs" element={<BlogList />} />
                    </Route>
                    <Route
                        path="*"
                        element={<ErrorPage errorCode="404" errorMessage="Page Not Found" />}
                    />
                </Routes>
            );
        } else {
            return (
                <Routes>
                    {/* User Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/start-writing" element={<StartWriting />} />
                    <Route path="/signin" element={<SigninForm />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/blogs/:slug" element={<BlogDetailsPage />} />

                    <Route
                        path="*"
                        element={<ErrorPage errorCode="404" errorMessage="Page Not Found" />}
                    />
                </Routes>
            );
        }
    };

    return (
        <div className={!(currentUser && currentUser.role === 'admin') ? "min-h-screen bg-gradient-to-t from-[#000000] to-[#1f2937] text-gray-300" : ""}>
            {!(currentUser && currentUser.role === 'admin') && (isLoggedIn ? <AfterLoginNav /> : <Navbar />)}
            <Suspense fallback={<LoadingSpinner />}>
                {renderContent()}
            </Suspense>
            {!(currentUser && currentUser.role === 'admin') && <Footer />}
        </div>
    );
};

export default HashRouterApp;