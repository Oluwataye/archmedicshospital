
import React from 'react';
import { LayoutDashboard, FileText, Settings, Users, Shield } from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getAdminNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', isActive: true },
  {
    name: 'Staff Management',
    icon: <Users size={20} />,
    path: '/staff',
    children: [
      { name: 'All Staff', path: '/staff' },
      { name: 'Roles & Permissions', path: '/staff/roles' },
      { name: 'Schedule', path: '/staff/schedule' }
    ]
  },
  { name: 'Reports', icon: <FileText size={20} />, path: '/reports' },
  { name: 'HMO Management', icon: <Shield size={20} />, path: '/admin/hmo' },
  { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];
