
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DiseasePrevalenceData } from '@/types/diseasePrevalence';
import ApiService from '@/services/apiService';

export const useDiseasePrevalence = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [ageGroup, setAgeGroup] = useState('all');
  const [gender, setGender] = useState('all');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getDiseasePrevalence({
          timeRange: timeRange !== 'all' ? timeRange : undefined,
          ageGroup: ageGroup !== 'all' ? ageGroup : undefined,
          gender: gender !== 'all' ? gender : undefined,
          search: searchTerm || undefined,
        });
        setData(response.data || []);
      } catch (error) {
        console.error('Error fetching disease prevalence:', error);
        toast.error('Failed to fetch disease prevalence data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, ageGroup, gender, searchTerm]);

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
    filteredData: data,
    totalCount: data.length,
    loading,
    handleExportReport,
    handleViewDetails
  };
};
