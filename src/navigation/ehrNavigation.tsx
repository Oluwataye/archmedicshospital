
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  User, 
  Calendar, 
  NotebookPen, 
  TestTube, 
  FileText as Imaging, 
  Pill, 
  BarChart2, 
  ChartBar, 
  Users, 
  FileSearch
} from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getEHRNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/ehr', isActive: true },
  { name: 'Patient Records', icon: <FileText size={20} />, path: '/ehr/records' },
  { name: 'Patient Management', icon: <Users size={20} />, path: '/ehr/patients' },
  { name: 'Appointments', icon: <Calendar size={20} />, path: '/ehr/appointments' },
  { 
    name: 'Clinical Notes', 
    icon: <NotebookPen size={20} />, 
    path: '/ehr/notes',
    children: [
      { name: 'Progress Notes', path: '/ehr/notes/progress' },
      { name: 'SOAP Notes', path: '/ehr/notes/soap' },
      { name: 'Discharge Notes', path: '/ehr/notes/discharge' },
    ]
  },
  { name: 'Lab Results', icon: <TestTube size={20} />, path: '/ehr/lab-results' },
  { name: 'Imaging', icon: <Imaging size={20} />, path: '/ehr/imaging' },
  { name: 'Medications', icon: <Pill size={20} />, path: '/ehr/medications' },
  { 
    name: 'Reports & Analytics', 
    icon: <BarChart2 size={20} />, 
    path: '/ehr/analytics',
    children: [
      { name: 'Patient Statistics', path: '/ehr/analytics/statistics' },
      { name: 'Disease Prevalence', path: '/ehr/analytics/disease' },
      { name: 'Treatment Outcomes', path: '/ehr/analytics/outcomes' },
    ]
  },
];
