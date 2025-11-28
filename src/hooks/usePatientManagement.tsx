
import { useState } from 'react';
import { toast } from "sonner";

// Sample patient data
const patientsData = [
  { 
    id: 'P-10237', 
    name: 'John Smith', 
    age: 42, 
    gender: 'Male', 
    contact: '(555) 123-4567',
    email: 'john.smith@example.com',
    address: '123 Main St, Cityville',
    dob: '1983-05-12',
    insurance: 'Blue Cross',
    status: 'Active',
    lastVisit: 'Apr 25, 2025'
  },
  { 
    id: 'P-10892', 
    name: 'Emily Davis', 
    age: 35, 
    gender: 'Female',
    contact: '(555) 987-6543',
    email: 'emily.davis@example.com',
    address: '456 Oak Ave, Townsville',
    dob: '1990-08-23',
    insurance: 'Aetna',
    status: 'Follow-up',
    lastVisit: 'Apr 22, 2025'
  },
  { 
    id: 'P-10745', 
    name: 'Michael Brown', 
    age: 58, 
    gender: 'Male',
    contact: '(555) 456-7890',
    email: 'michael.brown@example.com',
    address: '789 Pine Rd, Villagetown',
    dob: '1967-11-30',
    insurance: 'Medicare',
    status: 'New',
    lastVisit: 'Apr 27, 2025'
  },
  { 
    id: 'P-10478', 
    name: 'Sarah Johnson', 
    age: 29, 
    gender: 'Female',
    contact: '(555) 321-7654',
    email: 'sarah.johnson@example.com',
    address: '234 Elm St, Hamletville',
    dob: '1996-02-15',
    insurance: 'Cigna',
    status: 'Active',
    lastVisit: 'Apr 20, 2025'
  },
  { 
    id: 'P-10356', 
    name: 'David Wilson', 
    age: 64, 
    gender: 'Male',
    contact: '(555) 234-5678',
    email: 'david.wilson@example.com',
    address: '567 Maple Dr, Boroughville',
    dob: '1961-07-03',
    insurance: 'AARP',
    status: 'Discharged',
    lastVisit: 'Apr 15, 2025'
  },
  { 
    id: 'P-10589', 
    name: 'Jennifer Lee', 
    age: 41, 
    gender: 'Female',
    contact: '(555) 876-5432',
    email: 'jennifer.lee@example.com',
    address: '890 Cedar Ln, Districtville',
    dob: '1984-09-28',
    insurance: 'UnitedHealth',
    status: 'Active',
    lastVisit: 'Apr 23, 2025'
  }
];

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  address: string;
  dob: string;
  insurance: string;
  status: string;
  lastVisit: string;
}

export const usePatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>(patientsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Filter patients based on search term and filters
  const filteredPatients = patients.filter(patient => {
    // Search by name, ID or email
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus = statusFilter ? patient.status === statusFilter : true;

    // Filter by gender
    const matchesGender = genderFilter ? patient.gender === genderFilter : true;

    return matchesSearch && matchesStatus && matchesGender;
  });

  // Handle adding a new patient
  const handleNewPatientSave = (data: any) => {
    // Generate a new patient ID
    const newPatientId = `P-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Create a new patient object
    const newPatient: Patient = {
      id: newPatientId,
      name: data.name,
      age: parseInt(data.age),
      gender: data.gender,
      dob: data.dob,
      address: data.address,
      contact: data.phone,
      email: data.email,
      insurance: data.insurance || 'Not provided',
      status: data.status,
      lastVisit: 'Today'
    };
    
    // Add the new patient to the list
    setPatients([newPatient, ...patients]);
    
    // Show success message
    toast.success(`Patient ${data.name} registered successfully with ID: ${newPatientId}`);
  };

  // Handle patient deletion
  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(patient => patient.id !== id));
    toast.success(`Patient ${id} removed successfully`);
  };

  // Handle patient edit
  const handleEditPatient = (id: string) => {
    toast.info(`Edit patient ${id} details would open in a modal`);
  };

  // Handle export patient list
  const handleExportPatientList = () => {
    toast.success('Patient list exported successfully');
    // In a real app, this would generate a CSV or PDF
  };

  return {
    patients,
    filteredPatients,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    genderFilter,
    setGenderFilter,
    selectedPatient,
    setSelectedPatient,
    handleNewPatientSave,
    handleDeletePatient,
    handleEditPatient,
    handleExportPatientList
  };
};
