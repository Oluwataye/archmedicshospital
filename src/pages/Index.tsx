
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useHospitalSettings } from '@/contexts/HospitalSettingsContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const Index = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { settings } = useHospitalSettings();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // Redirect based on role
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'doctor':
            navigate('/doctor');
            break;
          case 'nurse':
            navigate('/nurse');
            break;
          case 'pharmacist':
            navigate('/pharmacy');
            break;
          case 'labtech':
            navigate('/lab');
            break;
          case 'cashier': // Added cashier role
            navigate('/cashier');
            break;
          default:
            navigate('/dashboard'); // Fallback
        }
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{settings?.hospital_name || 'Hospital Managment System'}</h1>
        <LoadingSpinner text="Redirecting..." />
      </div>
    </div>
  );
};

export default Index;
