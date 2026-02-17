import React from 'react';

const Loader = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;
