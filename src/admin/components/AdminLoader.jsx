import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const AdminLoader = () => {
    return (
        <>
            <div className="loader" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '70vh' }}>
                <Box>
                    <CircularProgress size={60} sx={{ color: '#800080' }} /> {/* Custom purple color */}
                </Box>
            </div>
        </>
    );
}

export default AdminLoader;
