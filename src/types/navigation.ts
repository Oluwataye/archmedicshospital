
import { ReactNode } from 'react';
import { UserRole } from '@/contexts/AuthContext';

export interface NavItem {
  name: string;
  icon: ReactNode;
  path: string;
  children?: { name: string; path: string }[];
  isActive?: boolean;
}

export type NavigationItems = Record<UserRole, NavItem[]>;
