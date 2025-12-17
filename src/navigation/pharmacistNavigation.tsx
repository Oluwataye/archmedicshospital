
import React from 'react';
import { LayoutDashboard, FileText, Package, PlusCircle, AlertTriangle, ShoppingCart, CreditCard, BarChart3 } from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getPharmacistNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/pharmacist', isActive: true },
  { name: 'Prescriptions', icon: <FileText size={20} />, path: '/pharmacist/prescriptions' },
  { name: 'Drug Inventory', icon: <Package size={20} />, path: '/pharmacist/inventory' },
  { name: 'Dispensary', icon: <PlusCircle size={20} />, path: '/pharmacist/dispensary' },
  { name: 'Interactions & Alerts', icon: <AlertTriangle size={20} />, path: '/pharmacist/alerts' },
  { name: 'Purchase Orders', icon: <ShoppingCart size={20} />, path: '/pharmacist/orders' },
  { name: 'Sales', icon: <CreditCard size={20} />, path: '/pharmacist/sales' },
  { name: 'Reports', icon: <BarChart3 size={20} />, path: '/pharmacist/reports' },
];
