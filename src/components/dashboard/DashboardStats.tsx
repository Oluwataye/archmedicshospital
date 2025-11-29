import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, CreditCard, Calendar, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description?: string;
    trend?: string;
    trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description, trend, trendUp }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {(description || trend) && (
                <p className="text-xs text-muted-foreground mt-1">
                    {trend && (
                        <span className={trendUp ? "text-green-500 font-medium mr-1" : "text-red-500 font-medium mr-1"}>
                            {trend}
                        </span>
                    )}
                    {description}
                </p>
            )}
        </CardContent>
    </Card>
);

const DashboardStats: React.FC<{ userRole: string }> = ({ userRole }) => {
    // Mock data - in a real app, this would come from an API based on the role
    const getStats = () => {
        switch (userRole) {
            case 'doctor':
                return [
                    { title: "Appointments Today", value: "12", icon: Calendar, trend: "+2", trendUp: true, description: "from yesterday" },
                    { title: "Pending Reports", value: "4", icon: FileText, trend: "-1", trendUp: true, description: "from yesterday" },
                    { title: "Total Patients", value: "1,234", icon: Users, trend: "+12%", trendUp: true, description: "from last month" },
                    { title: "Critical Cases", value: "2", icon: AlertCircle, trend: "0", trendUp: true, description: "active cases" },
                ];
            case 'nurse':
                return [
                    { title: "Assigned Patients", value: "8", icon: Users, description: "currently admitted" },
                    { title: "Vitals Pending", value: "3", icon: Activity, trend: "-2", trendUp: true, description: "due now" },
                    { title: "Tasks Completed", value: "15", icon: CheckCircle2, trend: "+5", trendUp: true, description: "today" },
                    { title: "Next Round", value: "14:00", icon: Clock, description: "in 45 mins" },
                ];
            case 'admin':
                return [
                    { title: "Total Revenue", value: "₦4.2M", icon: CreditCard, trend: "+20.1%", trendUp: true, description: "from last month" },
                    { title: "Active Staff", value: "45", icon: Users, trend: "+2", trendUp: true, description: "new hires" },
                    { title: "Total Patients", value: "12,345", icon: Activity, trend: "+180", trendUp: true, description: "new registrations" },
                    { title: "System Health", value: "99.9%", icon: Activity, trendUp: true, description: "uptime" },
                ];
            default:
                return [
                    { title: "Total Patients", value: "0", icon: Users },
                    { title: "Active Visits", value: "0", icon: Activity },
                    { title: "Today's Appointments", value: "0", icon: Calendar },
                    { title: "Pending Tasks", value: "0", icon: Clock },
                ];
        }
    };

    const stats = getStats();

    // Helper for icons that might not be imported in the switch
    const FileText = Activity; // Fallback

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default DashboardStats;
