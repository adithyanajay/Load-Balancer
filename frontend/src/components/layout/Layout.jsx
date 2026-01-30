import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-bg-gradient-start to-bg-gradient-end font-text text-gray-800">
            {/* Sidebar - Wider to prevent text wrapping */}
            <div className="hidden md:flex w-72 flex-col p-6 z-20">
                <Sidebar className="h-full" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative z-10">
                <TopBar />

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
