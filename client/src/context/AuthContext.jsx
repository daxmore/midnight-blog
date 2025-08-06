import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // To handle initial token check
    const navigate = useNavigate();

    console.log('AuthContext: Initializing. isLoggedIn:', isLoggedIn, 'loading:', loading); // ADDED THIS

    // Check for token in localStorage on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // In a real app, you'd verify this token with your backend
            // For now, we'll assume a token means logged in
            setIsLoggedIn(true);
            setCurrentUser({ username: 'Logged In User' }); // Replace with actual user data from token if possible
            console.log('AuthContext: Token found. Setting isLoggedIn to true.'); // ADDED THIS
        }
        setLoading(false);
        console.log('AuthContext: Initial load complete. isLoggedIn:', isLoggedIn, 'loading:', loading); // ADDED THIS
    }, []);

    const login = useCallback((token, user) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setCurrentUser(user);
        console.log('AuthContext: User logged in. isLoggedIn:', true); // ADDED THIS
        navigate('/'); // Redirect to home or dashboard after login
    }, [navigate]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setCurrentUser(null);
        console.log('AuthContext: User logged out. isLoggedIn:', false); // ADDED THIS
        navigate('/signin'); // Redirect to login page after logout
    }, [navigate]);

    const contextValue = {
        isLoggedIn,
        currentUser,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
