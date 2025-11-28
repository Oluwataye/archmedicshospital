
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import PatientRegistrationModal from '@/components/ehr/PatientRegistrationModal';
import DashboardHeader from '@/components/ehr/dashboard/DashboardHeader';
import QuickSearch from '@/components/ehr/dashboard/QuickSearch';
import StatsOverview from '@/components/ehr/dashboard/StatsOverview';
import FeaturedPatientVitals from '@/components/ehr/dashboard/FeaturedPatientVitals';
import RecentPatients from '@/components/ehr/dashboard/RecentPatients';
import RecentActivity from '@/components/ehr/dashboard/RecentActivity';
import QuickLinks from '@/components/ehr/dashboard/QuickLinks';

const EHRDashboard = () => {
  const navigate = useNavigate();
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Recent patients data
  const recentPatients = [
    {
      id: 'P-10237',
      name: 'John Smith',
      age: 42,
      gender: 'Male',
      status: 'Active',
      lastVisit: 'Apr 25, 2025',
      records: 3
    },
    {
      id: 'P-10892',
      name: 'Emily Davis',
      age: 35,
      gender: 'Female',
      status: 'Follow-up',
      lastVisit: 'Apr 22, 2025',
      records: 5
    },
    {
      id: 'P-10745',
      name: 'Michael Brown',
      age: 58,
      gender: 'Male',
      status: 'New',
      lastVisit: 'Today',
      records: 1
    },
  ];

  // Filter patients based on search query
  const filteredPatients = searchQuery.trim() === '' 
    ? recentPatients 
    : recentPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        patient.id.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleNewPatientSave = (data: any) => {
    // In a real app, this would call an API to save the patient data
    const newPatientId = `P-${Math.floor(10000 + Math.random() * 90000)}`;
    toast.success(`Patient ${data.name} registered successfully with ID: ${newPatientId}`);
    setIsRegistrationModalOpen(false);

    // Navigate to the patient records page after successful registration
    setTimeout(() => {
      navigate('/ehr/records');
    }, 1000);
  };
  
  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="space-y-6 p-6">
        {/* Dashboard Header with New Record button */}
        <DashboardHeader onOpenModal={() => setIsRegistrationModalOpen(true)} />

        {/* Patient Registration Modal */}
        <PatientRegistrationModal 
          open={isRegistrationModalOpen}
          onOpenChange={setIsRegistrationModalOpen}
          onSave={handleNewPatientSave}
        />

        {/* Quick Search */}
        <QuickSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Stats Overview */}
        <StatsOverview />

        {/* Featured Patient Vitals */}
        <FeaturedPatientVitals />

        {/* Recent Patients and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Patients */}
          <RecentPatients 
            patients={recentPatients}
            filteredPatients={filteredPatients}
          />

          {/* Recent Activity */}
          <RecentActivity />
        </div>

        {/* Quick Links */}
        <QuickLinks />
      </div>
    </ScrollArea>
  );
};

export default EHRDashboard;
