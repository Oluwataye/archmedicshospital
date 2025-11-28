
import React from 'react';
import { LayoutDashboard, FileText, Package, PlusCircle, AlertTriangle, ShoppingCart, CreditCard, BarChart3 } from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getPharmacistNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/pharmacy', isActive: true },
  { name: 'Prescriptions', icon: <FileText size={20} />, path: '/pharmacy/prescriptions' },
  { name: 'Drug Inventory', icon: <Package size={20} />, path: '/pharmacy/inventory' },
  { name: 'Dispensary', icon: <PlusCircle size={20} />, path: '/pharmacy/dispensary' },
  { name: 'Interactions & Alerts', icon: <AlertTriangle size={20} />, path: '/pharmacy/alerts' },
  { name: 'Purchase Orders', icon: <ShoppingCart size={20} />, path: '/pharmacy/orders' },
  { name: 'Sales', icon: <CreditCard size={20} />, path: '/pharmacy/sales' },
  { name: 'Reports', icon: <BarChart3 size={20} />, path: '/pharmacy/reports' },
];
