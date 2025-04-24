import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;