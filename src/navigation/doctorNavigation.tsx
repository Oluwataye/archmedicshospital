
import React from 'react';
import { LayoutDashboard, Calendar, User, FileCheck, FilePlus, Pill, UserCircle, Settings } from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getDoctorNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/doctor', isActive: true },
  { name: 'Appointments', icon: <Calendar size={20} />, path: '/doctor/appointments' },
  { name: 'Patients', icon: <User size={20} />, path: '/doctor/patients' },
  { name: 'Prescriptions', icon: <Pill size={20} />, path: '/doctor/prescriptions' },
  { name: 'Lab Orders', icon: <FileCheck size={20} />, path: '/doctor/lab-orders' },
  { name: 'Medical Records', icon: <FilePlus size={20} />, path: '/doctor/medical-records' },

  {
    name: 'Clinical Notes',
    icon: <FileCheck size={20} />,
    path: '/ehr/progress-notes',
    children: [
      { name: 'Progress Notes', path: '/ehr/progress-notes' },
      { name: 'SOAP Notes', path: '/ehr/soap-notes' },
      { name: 'Discharge Notes', path: '/ehr/discharge-notes' }
    ]
  },
  { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];
