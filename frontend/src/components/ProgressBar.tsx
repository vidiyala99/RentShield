import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const percentage = Math.min(100, Math.max(0, ((current + 1) / total) * 100));

    return (
        <div className="progress-container">
            <div className="progress-label">
                <span>Question {current + 1} of {total}</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
