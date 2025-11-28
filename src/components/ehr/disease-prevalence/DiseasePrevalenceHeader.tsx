import React from 'react';

const DiseasePrevalenceHeader: React.FC<any> = ({ onExportReport }) => {
    return (
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Disease Prevalence</h2>
        </div>
    );
};

export default DiseasePrevalenceHeader;
