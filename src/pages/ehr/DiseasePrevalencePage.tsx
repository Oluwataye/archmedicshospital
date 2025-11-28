
import React from 'react';
import { useDiseasePrevalence } from '@/hooks/useDiseasePrevalence';
import DiseasePrevalenceHeader from '@/components/ehr/disease-prevalence/DiseasePrevalenceHeader';
import DiseaseFilterOptions from '@/components/ehr/disease-prevalence/DiseaseFilterOptions';
import DiseasePrevalenceTable from '@/components/ehr/disease-prevalence/DiseasePrevalenceTable';

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
    handleExportReport,
    handleViewDetails
  } = useDiseasePrevalence();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <DiseasePrevalenceHeader onExportReport={handleExportReport} />
      
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

      <DiseasePrevalenceTable
        filteredData={filteredData}
        totalCount={totalCount}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default DiseasePrevalencePage;
