import React from 'react';

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-[50vh]">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );
}
