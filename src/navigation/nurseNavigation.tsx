
import React from 'react';
import { LayoutDashboard, User, Activity, Pill, ClipboardList, Users, AlertTriangle, MessageSquare } from 'lucide-react';
import { NavItem } from '@/types/navigation';

export const getNurseNavigation = (): NavItem[] => [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/nurse', isActive: true },
  { name: 'Patients', icon: <User size={20} />, path: '/nurse/patients' },
  { name: 'Vital Signs', icon: <Activity size={20} />, path: '/nurse/vitals' },
  { name: 'Medication', icon: <Pill size={20} />, path: '/nurse/medication' },
  { name: 'Tasks', icon: <ClipboardList size={20} />, path: '/nurse/tasks' },
  { name: 'Wards', icon: <Users size={20} />, path: '/nurse/wards' },
  { name: 'Alerts', icon: <AlertTriangle size={20} />, path: '/nurse/alerts' },
  { name: 'Communication', icon: <MessageSquare size={20} />, path: '/nurse/communication' },
];
