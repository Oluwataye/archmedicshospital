
import { useState } from 'react';
import { toast } from 'sonner';
import { DiseasePrevalenceData } from '@/types/diseasePrevalence';

// Sample disease prevalence data
const diseasePrevalenceData = [
  {
    id: 'DP-10045',
    disease: 'Hypertension',
    cases: 352,
    ageGroup: 'Adult (36-65)',
    gender: 'All',
    period: '2025 Q1',
    department: 'Cardiology',
    riskFactor: 'High',
    region: 'Urban',
    percentageIncrease: '+8%'
  },
  {
    id: 'DP-10046',
    disease: 'Type 2 Diabetes',
    cases: 278,
    ageGroup: 'Adult (36-65)',
    gender: 'All',
    period: '2025 Q1',
    department: 'Endocrinology',
    riskFactor: 'High',
    region: 'Urban',
    percentageIncrease: '+12%'
  },
  {
    id: 'DP-10047',
    disease: 'Asthma',
    cases: 192,
    ageGroup: 'All Ages',
    gender: 'All',
    period: '2025 Q1',
    department: 'Pulmonology',
    riskFactor: 'Medium',
    region: 'All',
    percentageIncrease: '+3%'
  },
  {
    id: 'DP-10048',
    disease: 'Influenza',
    cases: 423,
    ageGroup: 'All Ages',
    gender: 'All',
    period: '2025 Q1',
    department: 'General Medicine',
    riskFactor: 'Medium',
    region: 'All',
    percentageIncrease: '-15%'
  },
  {
    id: 'DP-10049',
    disease: 'COVID-19',
    cases: 118,
    ageGroup: 'All Ages',
    gender: 'All',
    period: '2025 Q1',
    department: 'Infectious Disease',
    riskFactor: 'Medium',
    region: 'All',
    percentageIncrease: '-42%'
  },
  {
    id: 'DP-10050',
    disease: 'Depression',
    cases: 245,
    ageGroup: 'Young Adult (18-35)',
    gender: 'All',
    period: '2025 Q1',
    department: 'Psychiatry',
    riskFactor: 'Medium',
    region: 'Urban',
    percentageIncrease: '+17%'
  }
];

export const useDiseasePrevalence = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [ageGroup, setAgeGroup] = useState('all');
  const [gender, setGender] = useState('all');
  
  // Filter data based on selected filters and search term
  const filteredData = diseasePrevalenceData.filter(item => {
    const matchesSearch = 
      item.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTimeRange = timeRange === 'all' || 
      (timeRange === 'current' && item.period === '2025 Q1');
    
    const matchesAgeGroup = ageGroup === 'all' || 
      item.ageGroup.toLowerCase().includes(ageGroup.toLowerCase());
    
    const matchesGender = gender === 'all' || 
      item.gender.toLowerCase() === gender.toLowerCase() ||
      item.gender.toLowerCase() === 'all';
    
    return matchesSearch && matchesTimeRange && matchesAgeGroup && matchesGender;
  });

  // Handle export report
  const handleExportReport = () => {
    toast.success('Disease prevalence report exported successfully');
    // In a real application, this would generate a PDF or CSV file
  };

  // Handle view details
  const handleViewDetails = (id: string) => {
    toast.info(`Viewing details for disease prevalence ${id}`);
    // In a real application, this would open a modal or navigate to a details page
  };

  return {
    searchTerm,
    setSearchTerm,
    timeRange,
    setTimeRange,
    ageGroup,
    setAgeGroup,
    gender,
    setGender,
    filteredData,
    totalCount: diseasePrevalenceData.length,
    handleExportReport,
    handleViewDetails
  };
};
