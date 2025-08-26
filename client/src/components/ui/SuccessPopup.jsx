import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const SuccessPopup = ({ isVisible, message = "Blog post published successfully!", onClose, autoCloseTime = 3000 }) => {
    const [isClosing, setIsClosing] = useState(false);

    // Handle closing animation
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    // Auto-close the popup after specified time
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                handleClose();
            }, autoCloseTime);

            return () => clearTimeout(timer);
        }
    }, [isVisible, autoCloseTime]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full transition-all duration-300 ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-bounce-in'
                }`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                            <FaCheck className="text-green-500 text-xl" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Success!</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300">{message}</p>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPopup;
