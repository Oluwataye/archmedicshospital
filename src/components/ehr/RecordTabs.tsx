import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RecordTabs: React.FC<any> = ({ activeTab, onTabChange, children }) => {
    return (
        <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList>
                <TabsTrigger value="all">All Records</TabsTrigger>
                <TabsTrigger value="vital-signs">Vital Signs</TabsTrigger>
                <TabsTrigger value="procedures">Procedures</TabsTrigger>
                <TabsTrigger value="allergies">Allergies</TabsTrigger>
                <TabsTrigger value="history">Medical History</TabsTrigger>
            </TabsList>
            {children}
        </Tabs>
    );
};

export default RecordTabs;
