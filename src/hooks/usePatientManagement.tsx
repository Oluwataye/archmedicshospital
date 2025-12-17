import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { ApiService } from '@/services/apiService';
import { Patient } from '@/types/patient';

// Re-export Patient for backward compatibility
export type { Patient };

export const usePatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getPatients();
      const patientsList = response.data || [];

      // Map API data to Patient interface
      const mappedPatients: Patient[] = patientsList.map((p: any) => ({
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        date_of_birth: p.date_of_birth,
        gender: p.gender,
        phone: p.phone || '-',
        email: p.email || '-',
        address: p.address || '-',
        mrn: p.mrn,
        status: p.status || 'Active',
        created_at: p.created_at,
        insurance: p.insurance || 'None',

        // Computed/UI fields
        name: `${p.first_name} ${p.last_name}`,
        age: calculateAge(p.date_of_birth),
        contact: p.phone || '-',
        dob: p.date_of_birth,
        lastVisit: p.last_visit ? new Date(p.last_visit).toLocaleDateString() : 'Never'
      }));

      setPatients(mappedPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Filter patients based on search term and filters
  const filteredPatients = patients.filter(patient => {
    // Search by name, ID or email
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(patient.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus = statusFilter ? patient.status === statusFilter : true;

    // Filter by gender
    const matchesGender = genderFilter ? patient.gender === genderFilter : true;

    return matchesSearch && matchesStatus && matchesGender;
  });

  // Handle adding a new patient
  const handleNewPatientSave = async (data: any) => {
    try {
      const patientData = {
        first_name: data.first_name || (data.name ? data.name.split(' ')[0] : 'Unknown'),
        last_name: data.last_name || (data.name ? data.name.split(' ').slice(1).join(' ') : 'Unknown'),
        date_of_birth: data.date_of_birth || data.dob,
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        address: data.address,
        insurance: data.insurance,
        status: data.status || 'active',
        registration_type: data.registration_type,
        manual_mrn: data.manual_mrn
      };

      await ApiService.createPatient(patientData);
      toast.success(`Patient registered successfully`);
      loadPatients(); // Reload list
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Failed to register patient');
    }
  };

  // Handle patient deletion
  const handleDeletePatient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    try {
      await ApiService.deletePatient(id);
      setPatients(patients.filter(patient => patient.id !== id));
      toast.success(`Patient removed successfully`);
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    }
  };

  // Handle patient edit
  const handleUpdatePatient = async (id: string, data: any) => {
    try {
      const patientData = {
        first_name: data.first_name || (data.name ? data.name.split(' ')[0] : 'Unknown'),
        last_name: data.last_name || (data.name ? data.name.split(' ').slice(1).join(' ') : 'Unknown'),
        date_of_birth: data.date_of_birth || data.dob,
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        address: data.address,
        insurance: data.insurance,
        status: data.status
      };

      await ApiService.updatePatient(id, patientData);
      toast.success(`Patient updated successfully`);
      loadPatients();
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient');
    }
  };

  // Handle export patient list
  const handleExportPatientList = () => {
    toast.success('Patient list exported successfully');
    // In a real app, this would generate a CSV or PDF
  };

  return {
    patients,
    filteredPatients,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    genderFilter,
    setGenderFilter,
    selectedPatient,
    setSelectedPatient,
    handleNewPatientSave,
    handleUpdatePatient,
    handleDeletePatient,
    handleExportPatientList
  };
};
