import React, { useState } from 'react';

const GradientSelectable = ({ children, className = '' }) => {
    const [showOverlay, setShowOverlay] = useState(false);

    const handleMouseUp = () => {
        const selection = window.getSelection();
        const selectedText = selection?.toString();
        setShowOverlay(!!selectedText);
    };

    const handleMouseDown = () => {
        setShowOverlay(false); // Hide overlay on new selection start
    };

    return (
        <div
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            className={`relative select-text cursor-text ${className}`}
        >
            <div className="relative z-10">{children}</div>

            {showOverlay && (
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 pointer-events-none rounded" />
            )}
        </div>
    );
};

export default GradientSelectable;
