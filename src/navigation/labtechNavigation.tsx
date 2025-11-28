
import React from 'react';
import { LayoutDashboard, FlaskConical, FileText, Boxes, ClipboardCheck, Microscope } from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getLabtechNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/lab', isActive: true },
  { name: 'Test Requests', icon: <FlaskConical size={20} />, path: '/lab/requests' },
  { 
    name: 'Results', 
    icon: <FileText size={20} />, 
    path: '/lab/results', 
    children: [
      { name: 'Pending Results', path: '/lab/results/pending' },
      { name: 'Completed Results', path: '/lab/results/completed' },
      { name: 'Critical Results', path: '/lab/results/critical' },
    ]
  },
  { name: 'Inventory', icon: <Boxes size={20} />, path: '/lab/inventory' },
  { name: 'Quality Control', icon: <ClipboardCheck size={20} />, path: '/lab/quality' },
  { name: 'Equipment', icon: <Microscope size={20} />, path: '/lab/equipment' },
];
