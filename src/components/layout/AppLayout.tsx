import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-background w-full">
            <Sidebar />
            <div className="flex flex-col flex-1 w-full overflow-hidden">
                <Header />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-muted/10">
                    <Outlet />
                    <footer className="mt-8 py-4 text-center text-xs text-muted-foreground border-t border-border/50">
                        2025 © T-Tech Solutions
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
