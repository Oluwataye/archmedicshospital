
import React from 'react';
import { LayoutDashboard, FlaskConical, FileText, Boxes, ClipboardCheck, Microscope, ScanBarcode } from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getLabtechNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/lab', isActive: true },
  { name: 'Worklist', icon: <FlaskConical size={20} />, path: '/lab/worklist' },
  { name: 'Sample Tracking', icon: <ScanBarcode size={20} />, path: '/lab/samples' },
  {
    name: 'Results',
    icon: <FileText size={20} />,
    path: '/lab/results',
    children: [
      { name: 'All Reports', path: '/lab/reports' },
      { name: 'Critical Results', path: '/lab/reports?status=critical' },
    ]
  },
  { name: 'Inventory', icon: <Boxes size={20} />, path: '/lab/inventory' },
  { name: 'Quality Control', icon: <ClipboardCheck size={20} />, path: '/lab/quality' },
  { name: 'Equipment', icon: <Microscope size={20} />, path: '/lab/equipment' },
];
