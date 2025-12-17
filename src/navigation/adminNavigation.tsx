

import React from 'react';
import { LayoutDashboard, FileText, Settings, Users, Shield, DollarSign, Building2, Stethoscope, TestTube, Database, ClipboardCheck, Microscope, ClipboardList } from 'lucide-react';
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
  {
    name: 'Reports',
    icon: <FileText size={20} />,
    path: '/admin/reports',
    children: [
      { name: 'Financial Dashboard', path: '/admin/financial' },
      { name: 'Transactions', path: '/admin/transactions' },
      { name: 'Cashier Activity', path: '/admin/cashier-activity' },
      { name: 'General Reports', path: '/admin/reports' }
    ]
  },
  {
    name: 'Laboratory',
    icon: <TestTube size={20} />,
    path: '/lab',
    children: [
      { name: 'Dashboard', path: '/lab' },
      { name: 'Worklist', path: '/lab/worklist' },
      { name: 'Inventory', path: '/lab/inventory' },
      { name: 'Equipment', path: '/lab/equipment' },
      { name: 'Quality Control', path: '/lab/quality' },
      { name: 'Reports', path: '/lab/reports' }
    ]
  },
  { name: 'Patient Management', icon: <Users size={20} />, path: '/admin/patients' },
  { name: 'User Management', icon: <Users size={20} />, path: '/admin/users' },
  { name: 'Departments', icon: <Building2 size={20} />, path: '/admin/departments' },
  { name: 'Units & Wards', icon: <Building2 size={20} />, path: '/admin/units' },
  { name: 'Services', icon: <Stethoscope size={20} />, path: '/admin/services' },
  {
    name: 'HMO Management',
    icon: <Shield size={20} />,
    path: '/admin/hmo',
    children: [
      { name: 'HMO Providers', path: '/admin/hmo' },
      { name: 'Verify Authorization', path: '/admin/authorization-verification' },
      { name: 'Authorization Logs', path: '/admin/authorization-logs' }
    ]
  },
  { name: 'Audit Logs', icon: <FileText size={20} />, path: '/admin/logs' },
  { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];
