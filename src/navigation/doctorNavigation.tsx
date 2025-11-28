
import React from 'react';
import { LayoutDashboard, Calendar, User, FileCheck, FilePlus, Pill } from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getDoctorNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', isActive: true },
  { name: 'Consultations', icon: <FilePlus size={20} />, path: '/consultations' },
  { name: 'Seen Patients', icon: <FileCheck size={20} />, path: '/patients' },
  { name: 'Appointments', icon: <Calendar size={20} />, path: '/appointments' },
  { name: 'Prescriptions', icon: <Pill size={20} />, path: '/prescriptions' },
];
