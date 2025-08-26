import React from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

const AuthLayout = ({ children }) => {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center text-gray-300">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </>
    );
};

export default AuthLayout;
