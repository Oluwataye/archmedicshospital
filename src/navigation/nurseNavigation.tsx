
import React from 'react';
import { LayoutDashboard, User, Activity, Pill, ClipboardList, Users, AlertTriangle, MessageSquare, UserCircle, Settings, FileText, Calendar, Stethoscope } from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getNurseNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/nurse', isActive: true },
  { name: 'Patients', icon: <User size={20} />, path: '/nurse/patients' },
  { name: 'Appointments', icon: <Calendar size={20} />, path: '/ehr/appointments' },
  { name: 'Vital Signs', icon: <Activity size={20} />, path: '/nurse/vitals' },
  { name: 'Medications', icon: <Pill size={20} />, path: '/nurse/medications' },
  { name: 'Progress Notes', icon: <ClipboardList size={20} />, path: '/ehr/progress-notes' },
  { name: 'SOAP Notes', icon: <Stethoscope size={20} />, path: '/ehr/soap-notes' },
  { name: 'Wards', icon: <Users size={20} />, path: '/nurse/wards' },
  { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];
