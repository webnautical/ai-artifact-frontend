import React from 'react';

export const StatusBtn = ({ btnName, status, rejectStatus }) => {
    const getStyle = () => {
        if (rejectStatus === 1) {
            return "red"; // Color for "Rejected"
        } else if (status) {
            return "green"; // Color for "Approved"
        } else {
            return "#fbc02d"; // Color for "Pending"
        }
    };

    return (
        <>
            <button className="status_btn" style={{ background: getStyle() }}>
                {btnName}
            </button>
        </>
    );
};
