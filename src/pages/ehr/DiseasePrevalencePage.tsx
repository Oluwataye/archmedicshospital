
import React, { useState } from 'react';
import { useDiseasePrevalence } from '@/hooks/useDiseasePrevalence';
import DiseasePrevalenceHeader from '@/components/ehr/disease-prevalence/DiseasePrevalenceHeader';
import DiseaseFilterOptions from '@/components/ehr/disease-prevalence/DiseaseFilterOptions';
import DiseasePrevalenceTable from '@/components/ehr/disease-prevalence/DiseasePrevalenceTable';
import DiseasePrevalenceChart from '@/components/analytics/DiseasePrevalenceChart';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { exportToPDF, exportToCSV, exportToExcel } from '@/utils/exportUtils';
import { toast } from 'sonner';

const DiseasePrevalencePage = () => {
  const {
    searchTerm,
    setSearchTerm,
    timeRange,
    setTimeRange,
    ageGroup,
    setAgeGroup,
    gender,
    setGender,
    filteredData,
    totalCount,
    loading,
    handleViewDetails
  } = useDiseasePrevalence();

  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  const handleExportPDF = () => {
    const columns = [
      { header: 'Disease', dataKey: 'disease' },
      { header: 'Cases', dataKey: 'cases' },
      { header: 'Department', dataKey: 'department' },
      { header: 'Age Group', dataKey: 'ageGroup' },
      { header: 'Trend', dataKey: 'percentageIncrease' },
      { header: 'Risk', dataKey: 'riskFactor' }
    ];
    exportToPDF('Disease_Prevalence_Report', filteredData, columns);
    toast.success('PDF report exported successfully');
  };

  const handleExportCSV = () => {
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Disease', dataKey: 'disease' },
      { header: 'Cases', dataKey: 'cases' },
      { header: 'Department', dataKey: 'department' },
      { header: 'Age Group', dataKey: 'ageGroup' },
      { header: 'Gender', dataKey: 'gender' },
      { header: 'Period', dataKey: 'period' },
      { header: 'Trend', dataKey: 'percentageIncrease' },
      { header: 'Risk Factor', dataKey: 'riskFactor' }
    ];
    exportToCSV('Disease_Prevalence_Data', filteredData, columns);
    toast.success('CSV file exported successfully');
  };

  const handleExportExcel = () => {
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Disease', dataKey: 'disease' },
      { header: 'Cases', dataKey: 'cases' },
      { header: 'Department', dataKey: 'department' },
      { header: 'Age Group', dataKey: 'ageGroup' },
      { header: 'Gender', dataKey: 'gender' },
      { header: 'Period', dataKey: 'period' },
      { header: 'Trend', dataKey: 'percentageIncrease' },
      { header: 'Risk Factor', dataKey: 'riskFactor' }
    ];
    exportToExcel('Disease_Prevalence_Data', filteredData, columns, 'Disease Prevalence');
    toast.success('Excel file exported successfully');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with Export Buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Disease Prevalence</h1>
          <p className="text-gray-500 text-sm">Analyze disease trends and patterns</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button onClick={handleExportCSV} variant="outline" size="sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button onClick={handleExportExcel} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      <DiseaseFilterOptions
        searchTerm={searchTerm}
        timeRange={timeRange}
        ageGroup={ageGroup}
        gender={gender}
        onSearchChange={setSearchTerm}
        onTimeRangeChange={setTimeRange}
        onAgeGroupChange={setAgeGroup}
        onGenderChange={setGender}
      />

      {/* Charts Section */}
      {!loading && filteredData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DiseasePrevalenceChart data={filteredData} chartType="bar" />
          <DiseasePrevalenceChart data={filteredData} chartType="pie" />
        </div>
      )}

      <DiseasePrevalenceTable
        filteredData={filteredData}
        totalCount={totalCount}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default DiseasePrevalencePage;
