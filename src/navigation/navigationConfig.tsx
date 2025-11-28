
import { NavigationItems } from '@/types/navigation';
import { getAdminNavigation } from './adminNavigation';
import { getDoctorNavigation } from './doctorNavigation';
import { getNurseNavigation } from './nurseNavigation';
import { getPharmacistNavigation } from './pharmacistNavigation';
import { getLabtechNavigation } from './labtechNavigation';
import { getCashierNavigation } from './cashierNavigation';
import { getEHRNavigation } from './ehrNavigation';

export const navigationItems: NavigationItems = {
  admin: getAdminNavigation(),
  doctor: getDoctorNavigation(),
  nurse: getNurseNavigation(),
  pharmacist: getPharmacistNavigation(),
  labtech: getLabtechNavigation(),
  cashier: getCashierNavigation(),
  ehr: getEHRNavigation(),
};

export const getNavigationItems = (role?: string) => {
  if (!role) return [];
  return navigationItems[role as keyof NavigationItems] || [];
};
