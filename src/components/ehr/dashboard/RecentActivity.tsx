import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentActivity: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p>No recent activity.</p>
            </CardContent>
        </Card>
    );
};

export default RecentActivity;
