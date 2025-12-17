
import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Printer,
  RefreshCw,
  Wallet,
  UserCircle,
  Settings,
  BarChart3,
  Building2,
  DollarSign
} from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getCashierNavigation = (): NavItem[] => [
  {
    name: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    path: '/cashier',
    isActive: true
  },
  {
    name: 'My Sales',
    icon: <TrendingUp size={20} />,
    path: '/cashier/sales',
    children: [
      {
        name: 'Transaction Summary',
        icon: <BarChart3 size={20} />,
        path: '/cashier/sales/summary'
      },
      {
        name: 'By Department',
        icon: <Building2 size={20} />,
        path: '/cashier/sales/by-department'
      },
      {
        name: 'By Ward',
        icon: <Building2 size={20} />,
        path: '/cashier/sales/by-ward'
      },
      {
        name: 'Revolving Fund',
        icon: <DollarSign size={20} />,
        path: '/cashier/sales/revolving-fund'
      }
    ]
  },
  {
    name: 'Reprint',
    icon: <Printer size={20} />,
    path: '/cashier/reprint'
  },
  {
    name: 'Refund',
    icon: <RefreshCw size={20} />,
    path: '/cashier/refunds'
  },
  {
    name: 'Deposit',
    icon: <Wallet size={20} />,
    path: '/cashier/deposits'
  },
  {
    name: 'Profile',
    icon: <UserCircle size={20} />,
    path: '/profile'
  },
  {
    name: 'Settings',
    icon: <Settings size={20} />,
    path: '/settings'
  },
];
