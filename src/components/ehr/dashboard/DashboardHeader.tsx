import React from 'react';

const DashboardHeader: React.FC<any> = ({ onOpenModal }) => {
    return (
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">EHR Dashboard</h2>
        </div>
    );
};

export default DashboardHeader;
