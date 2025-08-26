import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateBlogPage from './CreateBlogPost';

const StartWriting = () => {
    const { isLoggedIn, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            navigate('/signin');
        }
    }, [isLoggedIn, loading, navigate]);

    if (loading || !isLoggedIn) {
        // You can add a loading spinner here
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <CreateBlogPage />
        </div>
    );
};

export default StartWriting;