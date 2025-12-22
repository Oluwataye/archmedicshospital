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
    Building2,
    ChevronDown,
    RotateCcw,
    Bed
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
        roles: ['admin', 'ehr'],
    },
    // Doctor Portal Items - Moved to top for priority
    {
        title: 'Doctor Dashboard',
        href: '/doctor',
        icon: LayoutDashboard,
        roles: ['doctor'],
    },
    {
        title: 'Nurse Dashboard',
        href: '/nurse',
        icon: LayoutDashboard,
        roles: ['nurse'],
    },
    {
        title: 'Render Services',
        href: '/ehr/render-services',
        icon: Stethoscope,
        roles: ['ehr', 'nurse'],
    },
    {
        title: 'My Patients',
        href: '/nurse/patients',
        icon: Users,
        roles: ['nurse'],
    },
    {
        title: 'Appointments',
        href: '/ehr/appointments',
        icon: Calendar,
        roles: ['nurse'],
    },
    {
        title: 'My Patients',
        href: '/doctor/patients',
        icon: Users,
        roles: ['doctor'],
    },

    {
        title: 'Appointments',
        href: '/doctor/appointments',
        icon: Calendar,
        roles: ['doctor'],
    },

    {
        title: 'Cashier Portal',
        href: '/admin/cashier',
        icon: CreditCard,
        roles: ['admin'],
    },
    {
        title: 'Refunds',
        href: '/admin/refunds',
        icon: RotateCcw,
        roles: ['admin'],
    },


    // Admin Core
    {
        title: 'HMO Management',
        href: '/admin/hmo',
        icon: Building2,
        roles: ['admin'],
        children: [
            {
                title: 'Providers',
                href: '/admin/hmo',
                icon: Building2,
            },
            {
                title: 'Claims',
                href: '/cashier/claims',
                icon: FileText,
            },
            {
                title: 'Pre-Auth',
                href: '/cashier/preauth',
                icon: Shield,
            },
            {
                title: 'Auth Verification',
                href: '/ehr/authorization-verification',
                icon: Shield,
            },
        ]
    },
    {
        title: 'Staff Management',
        href: '/staff',
        icon: Users,
        roles: ['admin'],
        children: [
            {
                title: 'All Staff',
                href: '/staff',
                icon: Users,
            },
            {
                title: 'Schedule',
                href: '/staff/schedule',
                icon: Calendar,
            },
            {
                title: 'Roles & Permissions',
                href: '/staff/roles',
                icon: Shield,
            },
        ]
    },
    {
        title: 'Services Management',
        href: '/admin/services',
        icon: Stethoscope,
        roles: ['admin'],
    },
    // EHR Core
    // EHR Core
    {
        title: 'Patient Records',
        href: '/ehr/patient-records',
        icon: FileText,
        roles: ['ehr', 'admin', 'doctor'],
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
        roles: ['ehr', 'admin'],
    },
    {
        title: 'Imaging',
        href: '/ehr/imaging',
        icon: Activity,
        roles: ['ehr', 'doctor', 'admin', 'nurse'],
    },
    {
        title: 'Ward Occupancy',
        href: '/admin/reports/ward-occupancy',
        icon: Bed,
        roles: ['admin', 'nurse'],
    },
    {
        title: 'Medication Compliance',
        href: '/admin/reports/medication-compliance',
        icon: Pill,
        roles: ['admin', 'nurse'],
    },




    {
        title: 'Vitals',
        href: '/nurse/vitals',
        icon: Activity,
        roles: ['nurse'],
    },
    {
        title: 'Medications',
        href: '/nurse/medications',
        icon: Pill,
        roles: ['nurse'],
    },
    {
        title: 'Ward Management',
        href: '/nurse/wards',
        icon: Building2,
        roles: ['nurse', 'admin'],
    },
    {
        title: 'Progress Notes',
        href: '/ehr/progress-notes',
        icon: ClipboardList,
        roles: ['nurse'],
    },
    {
        title: 'SOAP Notes',
        href: '/ehr/soap-notes',
        icon: Stethoscope,
        roles: ['nurse'],
    },
    {
        title: 'Pharmacy',
        href: '/pharmacy',
        icon: Pill,
        roles: ['pharmacist', 'admin'],
        children: [
            {
                title: 'Dashboard',
                href: '/pharmacy',
                icon: LayoutDashboard,
            },
            {
                title: 'Dispensary',
                href: '/pharmacy/dispensary',
                icon: Pill,
            },
            {
                title: 'Inventory',
                href: '/pharmacy/inventory',
                icon: Database,
            },
            {
                title: 'Prescriptions',
                href: '/pharmacy/prescriptions',
                icon: FileText,
            },
        ]
    },
    {
        title: 'Laboratory',
        href: '/lab',
        icon: TestTube,
        roles: ['labtech', 'admin'],
        children: [
            {
                title: 'Dashboard',
                href: '/lab',
                icon: LayoutDashboard,
            },
            {
                title: 'Worklist',
                href: '/lab/worklist',
                icon: ClipboardList,
            },
            {
                title: 'Results',
                href: '/ehr/lab-results',
                icon: TestTube,
            },
            {
                title: 'Inventory',
                href: '/lab/inventory',
                icon: Database,
            },
            {
                title: 'Equipment',
                href: '/lab/equipment',
                icon: Settings,
            },
        ]
    },

    // Finance

    {
        title: 'Cashier & Billing',
        href: '/cashier',
        icon: CreditCard,
        roles: ['admin'],
        children: [
            {
                title: 'Dashboard',
                href: '/cashier',
                icon: LayoutDashboard,
            },
            {
                title: 'Billing',
                href: '/cashier/billing',
                icon: CreditCard,
            },
            {
                title: 'Claims',
                href: '/cashier/claims',
                icon: FileText,
            },
            {
                title: 'Pre-Auth',
                href: '/cashier/preauth',
                icon: Shield,
            },
        ]
    },
    // Flattened Cashier Items
    {
        title: 'Cashier Dashboard',
        href: '/cashier',
        icon: LayoutDashboard,
        roles: ['cashier'],
    },
    {
        title: 'Billing',
        href: '/cashier/billing',
        icon: CreditCard,
        roles: ['cashier'],
    },
    {
        title: 'Claims',
        href: '/cashier/claims',
        icon: FileText,
        roles: ['cashier'],
    },
    {
        title: 'Pre-Auth',
        href: '/cashier/preauth',
        icon: Shield,
        roles: ['cashier'],
    },
    // Analytics & System
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
    {
        title: 'System Settings',
        href: '/admin/settings',
        icon: Settings,
        roles: ['admin'],
    },
];

const Sidebar = ({ className }: SidebarProps) => {
    const { user } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    if (!user) return null;

    const filteredNavItems = navItems.filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(user.role);
    });

    const toggleExpanded = (title: string) => {
        setExpandedItems(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    const isActiveParent = (item: NavItem) => {
        if (location.pathname === item.href) return true;
        if (item.children) {
            return item.children.some(child => location.pathname === child.href);
        }
        return false;
    };

    // Auto-expand parents when on a child route
    React.useEffect(() => {
        const activeParent = filteredNavItems.find(item => item.children?.some(child => child.href === location.pathname));
        if (activeParent && !expandedItems.includes(activeParent.title)) {
            setExpandedItems(prev => [...prev, activeParent.title]);
        }
    }, [location.pathname]);

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
                    {filteredNavItems.map((item, index) => {
                        const isExpanded = expandedItems.includes(item.title);
                        const hasChildren = item.children && item.children.length > 0;
                        const isActive = isActiveParent(item);

                        return (
                            <div key={index}>
                                {hasChildren && !collapsed ? (
                                    <>
                                        <button
                                            onClick={() => toggleExpanded(item.title)}
                                            className={cn(
                                                "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                                                isActive ? "bg-muted text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </button>

                                        {isExpanded && (
                                            <div className="ml-4 mt-1 grid gap-1 border-l pl-2 animate-in slide-in-from-top-2 duration-200">
                                                {item.children!
                                                    .filter(child => !child.roles || child.roles.includes(user.role))
                                                    .map((child, childIndex) => (
                                                        <NavLink
                                                            key={childIndex}
                                                            to={child.href}
                                                            className={({ isActive }) =>
                                                                cn(
                                                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                                                    isActive ? "bg-secondary text-primary font-semibold" : "text-muted-foreground hover:bg-secondary/50"
                                                                )
                                                            }
                                                        >
                                                            <child.icon className="h-3.5 w-3.5" />
                                                            <span>{child.title}</span>
                                                        </NavLink>
                                                    ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
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
                                )}
                            </div>
                        );
                    })}
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
