import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Stethoscope,
    Pill,
    TestTube,
    CreditCard,
    FileText,
    Settings,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Shield,
    Activity,
    Calendar,
    ClipboardList,
    UserPlus,
    BarChart3,
    Database,
    Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SidebarProps {
    className?: string;
}

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    roles?: UserRole[];
    children?: NavItem[];
}

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        roles: ['admin', 'doctor', 'nurse', 'pharmacist', 'labtech', 'cashier', 'ehr'],
    },
    // Admin Routes
    {
        title: 'HMO Management',
        href: '/admin/hmo',
        icon: Building2,
        roles: ['admin'],
    },
    // EHR Routes
    {
        title: 'Patient Records',
        href: '/ehr/patient-records',
        icon: FileText,
        roles: ['ehr', 'doctor', 'nurse'],
    },
    {
        title: 'Patient Management',
        href: '/ehr/patient-management',
        icon: Users,
        roles: ['ehr', 'admin'],
    },
    {
        title: 'Appointments',
        href: '/ehr/appointments',
        icon: Calendar,
        roles: ['ehr', 'doctor', 'nurse'],
    },
    {
        title: 'Clinical Notes',
        href: '/ehr/progress-notes',
        icon: ClipboardList,
        roles: ['ehr', 'doctor', 'nurse'],
        children: [
            {
                title: 'Progress Notes',
                href: '/ehr/progress-notes',
                icon: FileText,
            },
            {
                title: 'SOAP Notes',
                href: '/ehr/soap-notes',
                icon: FileText,
            },
            {
                title: 'Discharge Notes',
                href: '/ehr/discharge-notes',
                icon: FileText,
            },
        ]
    },
    {
        title: 'Lab Results',
        href: '/ehr/lab-results',
        icon: TestTube,
        roles: ['ehr', 'doctor', 'labtech'],
    },
    {
        title: 'Imaging',
        href: '/ehr/imaging',
        icon: Activity,
        roles: ['ehr', 'doctor'],
    },
    {
        title: 'Medications',
        href: '/ehr/medications',
        icon: Pill,
        roles: ['ehr', 'doctor', 'pharmacist', 'nurse'],
    },
    {
        title: 'Analytics',
        href: '/ehr/analytics',
        icon: BarChart3,
        roles: ['ehr', 'admin'],
        children: [
            {
                title: 'Statistics',
                href: '/ehr/analytics/statistics',
                icon: BarChart3,
            },
            {
                title: 'Disease Prevalence',
                href: '/ehr/analytics/disease-prevalence',
                icon: Activity,
            },
            {
                title: 'Treatment Outcomes',
                href: '/ehr/analytics/treatment-outcomes',
                icon: Activity,
            },
        ]
    },
    // Cashier Routes
    {
        title: 'Claims',
        href: '/cashier/claims',
        icon: FileText,
        roles: ['cashier', 'admin'],
    },
    {
        title: 'Pre-Authorization',
        href: '/cashier/preauth',
        icon: Shield,
        roles: ['cashier', 'admin'],
    },
];

const Sidebar = ({ className }: SidebarProps) => {
    const { user } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    if (!user) return null;

    const filteredNavItems = navItems.filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(user.role);
    });

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-card border-r">
            <div className={cn("flex items-center h-16 px-4 border-b", collapsed ? "justify-center" : "justify-between")}>
                {!collapsed && (
                    <span className="text-xl font-bold text-primary truncate">
                        Archmedics
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            <ScrollArea className="flex-1 py-4">
                <nav className="grid gap-1 px-2">
                    {filteredNavItems.map((item, index) => (
                        <div key={index}>
                            <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                        isActive ? "bg-muted text-primary" : "text-muted-foreground",
                                        collapsed && "justify-center px-2"
                                    )
                                }
                                title={collapsed ? item.title : undefined}
                            >
                                <item.icon className="h-4 w-4" />
                                {!collapsed && <span>{item.title}</span>}
                            </NavLink>

                            {!collapsed && item.children && (
                                <div className="ml-6 mt-1 grid gap-1 border-l pl-2">
                                    {item.children.map((child, childIndex) => (
                                        <NavLink
                                            key={childIndex}
                                            to={child.href}
                                            className={({ isActive }) =>
                                                cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                                                )
                                            }
                                        >
                                            <span>{child.title}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </ScrollArea>

            <div className="p-4 border-t">
                <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.firstName[0]}{user.lastName[0]}
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">{user.firstName} {user.lastName}</span>
                            <span className="text-xs text-muted-foreground truncate capitalize">{user.role}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={cn("hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300", collapsed ? "w-16" : "w-64", className)}>
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <SidebarContent />
                </SheetContent>
            </Sheet>
        </>
    );
};

export default Sidebar;
