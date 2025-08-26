import { createContext, useContext, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token')); // New state for token
    const navigate = useNavigate();

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null); // Clear token state
        setIsLoggedIn(false);
        setCurrentUser(null);
        navigate('/signin');
    }, [navigate]);

    useLayoutEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    console.log("Token expired, logging out.");
                    logout();
                } else {
                    setIsLoggedIn(true);
                    setCurrentUser({
                        id: decoded.id,
                        role: decoded.role,
                        username: decoded.username
                        // You can add other user info here if it's in the token
                    });
                    console.log("Decoded token role:", decoded.role);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
        setTimeout(() => {
            setLoading(false);
        }, 100); // Add a small delay
    }, [token, logout]);

    const login = useCallback((newToken, user) => {
        localStorage.setItem('token', newToken);
        setToken(newToken); // Set token state
        setIsLoggedIn(true);
    }, []);

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