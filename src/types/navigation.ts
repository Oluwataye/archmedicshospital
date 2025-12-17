
import { ReactNode } from 'react';
import { UserRole } from '@/contexts/AuthContext';

export interface NavItem {
  name: string;
  icon?: ReactNode;
  path: string;
  children?: NavItem[];
  isActive?: boolean;
}

export type NavigationItems = Record<UserRole, NavItem[]>;
