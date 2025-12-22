import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, CreditCard, Calendar, TrendingUp, AlertCircle, CheckCircle2, Clock, FileText, TestTube } from 'lucide-react';
import { ApiService } from '@/services/apiService';
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description?: string;
    trend?: string;
    trendUp?: boolean;
    onClick?: () => void;
    accentClass?: string;
}

const getAccentColors = (accentClass?: string) => {
    if (!accentClass) return { text: 'text-muted-foreground', bg: 'bg-muted' };
    if (accentClass.includes('blue')) return { text: 'text-blue-600', bg: 'bg-blue-100' };
    if (accentClass.includes('green')) return { text: 'text-green-600', bg: 'bg-green-100' };
    if (accentClass.includes('purple')) return { text: 'text-purple-600', bg: 'bg-purple-100' };
    if (accentClass.includes('orange')) return { text: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (accentClass.includes('red')) return { text: 'text-red-600', bg: 'bg-red-100' };
    return { text: 'text-muted-foreground', bg: 'bg-muted' };
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description, trend, trendUp, onClick, accentClass }) => {
    const colors = getAccentColors(accentClass);
    return (
        <Card
            className={`cursor-pointer hover:shadow-lg transition-all hover:scale-105 ${accentClass || ''}`}
            onClick={onClick}
        >
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h2 className={`text-3xl font-bold mt-1 mb-1 ${colors.text}`}>{value}</h2>
                    {(description || trend) && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {trend && (
                                <span className={trendUp ? "text-green-500 font-medium mr-1" : "text-red-500 font-medium mr-1"}>
                                    {trend}
                                </span>
                            )}
                            {description} {onClick && '→'}
                        </p>
                    )}
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${colors.bg}`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
            </CardContent>
        </Card>
    );
};

const DashboardStats: React.FC<{ userRole: string }> = ({ userRole }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                if (userRole === 'admin') {
                    const [paymentStats, userStats, patientData] = await Promise.all([
                        ApiService.getPaymentStatistics(),
                        ApiService.getUserStats(),
                        ApiService.getPatients({ limit: 1 })
                    ]);

                    setStats([
                        {
                            title: "Total Revenue",
                            value: `₦${(paymentStats.monthRevenue || 0).toLocaleString()}`,
                            icon: CreditCard,
                            trend: "+20.1%", // Placeholder for trend
                            trendUp: true,
                            description: "this month",
                            onClick: () => navigate('/admin/reports?tab=financial'),
                            accentClass: "card-accent-green"
                        },
                        {
                            title: "Active Staff",
                            value: userStats.active,
                            icon: Users,
                            description: `${userStats.total} total users`,
                            onClick: () => navigate('/admin/users'),
                            accentClass: "card-accent-purple"
                        },
                        {
                            title: "Total Patients",
                            value: patientData.total.toLocaleString(),
                            icon: Activity,
                            description: "registered patients",
                            onClick: () => navigate('/admin/reports?tab=patients'),
                            accentClass: "card-accent-blue"
                        },
                        {
                            title: "System Health",
                            value: "99.9%",
                            icon: Activity,
                            trendUp: true,
                            description: "uptime",
                            onClick: () => navigate('/admin/settings'),
                            accentClass: "card-accent-orange"
                        },
                    ]);
                } else {
                    // Keep mock data for other roles for now
                    setStats(getMockStats(userRole));
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setStats(getMockStats(userRole));
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userRole, navigate]);

    const getMockStats = (role: string) => {
        switch (role) {
            case 'doctor':
                return [
                    {
                        title: "Appointments Today",
                        value: "12",
                        icon: Calendar,
                        trend: "+2",
                        trendUp: true,
                        description: "from yesterday",
                        onClick: () => navigate('/doctor/appointments'),
                        accentClass: "card-accent-blue"
                    },
                    {
                        title: "Pending Reports",
                        value: "4",
                        icon: FileText,
                        trend: "-1",
                        trendUp: true,
                        description: "from yesterday",
                        onClick: () => navigate('/doctor/lab-orders'),
                        accentClass: "card-accent-orange"
                    },
                    {
                        title: "Total Patients",
                        value: "1,234",
                        icon: Users,
                        trend: "+12%",
                        trendUp: true,
                        description: "from last month",
                        onClick: () => navigate('/doctor/patients'),
                        accentClass: "card-accent-green"
                    },
                    {
                        title: "Critical Cases",
                        value: "2",
                        icon: AlertCircle,
                        trend: "0",
                        trendUp: true,
                        description: "active cases",
                        onClick: () => navigate('/doctor/patients?status=critical'),
                        accentClass: "card-accent-purple"
                    },
                ];
            case 'nurse':
                return [
                    {
                        title: "Assigned Patients",
                        value: "8",
                        icon: Users,
                        description: "currently admitted",
                        onClick: () => navigate('/nurse/patients'),
                        accentClass: "card-accent-blue"
                    },
                    {
                        title: "Vitals Pending",
                        value: "3",
                        icon: Activity,
                        trend: "-2",
                        trendUp: true,
                        description: "due now",
                        onClick: () => navigate('/nurse/vitals'),
                        accentClass: "card-accent-orange"
                    },
                    {
                        title: "Tasks Completed",
                        value: "15",
                        icon: CheckCircle2,
                        trend: "+5",
                        trendUp: true,
                        description: "today",
                        onClick: () => navigate('/nurse/tasks'),
                        accentClass: "card-accent-green"
                    },
                    {
                        title: "Next Round",
                        value: "14:00",
                        icon: Clock,
                        description: "in 45 mins",
                        onClick: () => navigate('/nurse/rounds'),
                        accentClass: "card-accent-purple"
                    },
                ];
            case 'pharmacist':
                return [
                    {
                        title: "Pending Prescriptions",
                        value: "18",
                        icon: FileText,
                        trend: "+4",
                        trendUp: false,
                        description: "awaiting processing",
                        onClick: () => navigate('/pharmacist/prescriptions'),
                        accentClass: "card-accent-orange"
                    },
                    {
                        title: "Low Stock Items",
                        value: "5",
                        icon: AlertCircle,
                        trend: "-2",
                        trendUp: true,
                        description: "needs reorder",
                        onClick: () => navigate('/pharmacist/inventory?filter=low_stock'),
                        accentClass: "card-accent-purple"
                    },
                    {
                        title: "Today's Sales",
                        value: "₦125k",
                        icon: CreditCard,
                        trend: "+15%",
                        trendUp: true,
                        description: "vs yesterday",
                        onClick: () => navigate('/pharmacist/sales'),
                        accentClass: "card-accent-green"
                    },
                    {
                        title: "Expiring Soon",
                        value: "12",
                        icon: Clock,
                        description: "next 30 days",
                        onClick: () => navigate('/pharmacist/inventory?filter=expiring'),
                        accentClass: "card-accent-blue"
                    },
                ];
            case 'labtech':
                return [
                    {
                        title: "Pending Tests",
                        value: "9",
                        icon: TestTube,
                        trend: "+3",
                        trendUp: false,
                        description: "in queue",
                        onClick: () => navigate('/lab/requests'),
                        accentClass: "card-accent-blue"
                    },
                    {
                        title: "Results Ready",
                        value: "14",
                        icon: CheckCircle2,
                        trend: "+8",
                        trendUp: true,
                        description: "waiting for review",
                        onClick: () => navigate('/lab/results'),
                        accentClass: "card-accent-green"
                    },
                    {
                        title: "Critical Results",
                        value: "1",
                        icon: AlertCircle,
                        trend: "0",
                        trendUp: true,
                        description: "requires immediate attention",
                        onClick: () => navigate('/lab/results?status=critical'),
                        accentClass: "card-accent-purple"
                    },
                    {
                        title: "Equipment Status",
                        value: "All OK",
                        icon: Activity,
                        description: "daily check completed",
                        onClick: () => navigate('/lab/equipment'),
                        accentClass: "card-accent-orange"
                    },
                ];
            case 'ehr':
                return [
                    {
                        title: "Total Patients",
                        value: "2,845",
                        icon: Users,
                        trend: "+12",
                        trendUp: true,
                        description: "registered records",
                        onClick: () => navigate('/ehr/patient-management'),
                        accentClass: "card-accent-blue"
                    },
                    {
                        title: "Appointments",
                        value: "24",
                        icon: Calendar,
                        trend: "+4",
                        trendUp: true,
                        description: "scheduled today",
                        onClick: () => navigate('/ehr/appointments'),
                        accentClass: "card-accent-green"
                    },
                    {
                        title: "Pending Labs",
                        value: "8",
                        icon: TestTube,
                        description: "results awaiting",
                        onClick: () => navigate('/ehr/lab-results'),
                        accentClass: "card-accent-orange"
                    },
                    {
                        title: "Analytics",
                        value: "View",
                        icon: Activity,
                        description: "hospital stats",
                        onClick: () => navigate('/ehr/analytics/statistics'),
                        accentClass: "card-accent-purple"
                    },
                ];
            case 'admin':
                return [
                    {
                        title: "Total Revenue",
                        value: "₦0",
                        icon: CreditCard,
                        trend: "+0%",
                        trendUp: true,
                        description: "this month",
                        onClick: () => navigate('/admin/reports?tab=financial'),
                        accentClass: "card-accent-green"
                    },
                    {
                        title: "Active Staff",
                        value: "0",
                        icon: Users,
                        description: "total users",
                        onClick: () => navigate('/admin/users'),
                        accentClass: "card-accent-purple"
                    },
                    {
                        title: "Total Patients",
                        value: "0",
                        icon: Activity,
                        description: "registered patients",
                        onClick: () => navigate('/admin/reports?tab=patients'),
                        accentClass: "card-accent-blue"
                    },
                    {
                        title: "System Health",
                        value: "99.9%",
                        icon: Activity,
                        trendUp: true,
                        description: "uptime",
                        onClick: () => navigate('/admin/settings'),
                        accentClass: "card-accent-orange"
                    },
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

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px] mb-2" />
                            <Skeleton className="h-3 w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default DashboardStats;
