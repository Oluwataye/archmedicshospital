import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentPatients: React.FC<any> = ({ patients, filteredPatients }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
            </CardHeader>
            <CardContent>
                <p>No recent patients.</p>
            </CardContent>
        </Card>
    );
};

export default RecentPatients;
