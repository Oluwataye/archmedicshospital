import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuickLinks: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    {/* Add links here */}
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickLinks;
