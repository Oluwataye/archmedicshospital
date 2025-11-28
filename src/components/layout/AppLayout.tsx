import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
