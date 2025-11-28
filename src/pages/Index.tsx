
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/ehr'); // Direct to EHR dashboard instead of /dashboard
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-medical-primary flex items-center justify-center text-white text-2xl font-bold">
          A
        </div>
        <h1 className="mt-4 text-3xl font-bold">ARCHMEDICS HMS</h1>
        <p className="mt-2 text-xl text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
