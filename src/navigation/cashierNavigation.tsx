
import React from 'react';
import { LayoutDashboard, FileText, RefreshCw, ArrowRight, CreditCard, FileCheck, Shield } from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getCashierNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/cashier', isActive: true },
  { name: 'Claims Management', icon: <FileCheck size={20} />, path: '/cashier/claims' },
  { name: 'Pre-Authorization', icon: <Shield size={20} />, path: '/cashier/preauth' },
  { name: 'Reports', icon: <FileText size={20} />, path: '/cashier/reports' },
  { name: 'Receipt Reprint', icon: <RefreshCw size={20} />, path: '/cashier/reprint' },
  { name: 'Refunds', icon: <ArrowRight size={20} />, path: '/cashier/refunds' },
  { name: 'Billing', icon: <CreditCard size={20} />, path: '/billing' },
  { name: 'Payments', icon: <CreditCard size={20} />, path: '/payments' },
];
