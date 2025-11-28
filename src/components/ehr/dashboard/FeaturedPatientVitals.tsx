import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturedPatientVitals: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Vitals</CardTitle>
            </CardHeader>
            <CardContent>
                <p>No recent vitals recorded.</p>
            </CardContent>
        </Card>
    );
};

export default FeaturedPatientVitals;
