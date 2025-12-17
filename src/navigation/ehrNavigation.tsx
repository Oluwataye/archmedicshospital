import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  NotebookPen,
  TestTube,
  FileText as Imaging,
  Pill,
  BarChart2,
  Shield
} from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getEHRNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/ehr', isActive: true },
  { name: 'Patient Records', icon: <FileText size={20} />, path: '/ehr/patient-records' },
  { name: 'Patient Management', icon: <Users size={20} />, path: '/ehr/patient-management' },
  { name: 'HMO Authorization', icon: <Shield size={20} />, path: '/ehr/authorization-verification' },
  { name: 'Appointments', icon: <Calendar size={20} />, path: '/ehr/appointments' },
  {
    name: 'Clinical Notes',
    icon: <NotebookPen size={20} />,
    path: '/ehr/progress-notes',
    children: [
      { name: 'Progress Notes', path: '/ehr/progress-notes' },
      { name: 'SOAP Notes', path: '/ehr/soap-notes' },
      { name: 'Discharge Notes', path: '/ehr/discharge-notes' },
    ]
  },
  { name: 'Lab Results', icon: <TestTube size={20} />, path: '/ehr/lab-results' },
  { name: 'Imaging', icon: <Imaging size={20} />, path: '/ehr/imaging' },
  { name: 'Medications', icon: <Pill size={20} />, path: '/ehr/medications' },
  {
    name: 'Reports & Analytics',
    icon: <BarChart2 size={20} />,
    path: '/ehr/analytics/statistics',
    children: [
      { name: 'Patient Statistics', path: '/ehr/analytics/statistics' },
      { name: 'Disease Prevalence', path: '/ehr/analytics/disease-prevalence' },
      { name: 'Treatment Outcomes', path: '/ehr/analytics/treatment-outcomes' },
    ]
  },
];
