"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useDiseasePrevalence_1 = require("@/hooks/useDiseasePrevalence");
var DiseasePrevalenceHeader_1 = require("@/components/ehr/disease-prevalence/DiseasePrevalenceHeader");
var DiseaseFilterOptions_1 = require("@/components/ehr/disease-prevalence/DiseaseFilterOptions");
var DiseasePrevalenceTable_1 = require("@/components/ehr/disease-prevalence/DiseasePrevalenceTable");
var DiseasePrevalencePage = function () {
    var _a = (0, useDiseasePrevalence_1.useDiseasePrevalence)(), searchTerm = _a.searchTerm, setSearchTerm = _a.setSearchTerm, timeRange = _a.timeRange, setTimeRange = _a.setTimeRange, ageGroup = _a.ageGroup, setAgeGroup = _a.setAgeGroup, gender = _a.gender, setGender = _a.setGender, filteredData = _a.filteredData, totalCount = _a.totalCount, handleExportReport = _a.handleExportReport, handleViewDetails = _a.handleViewDetails;
    return (<div className="container mx-auto py-6 space-y-6">
      <DiseasePrevalenceHeader_1.default onExportReport={handleExportReport}/>
      
      <DiseaseFilterOptions_1.default searchTerm={searchTerm} timeRange={timeRange} ageGroup={ageGroup} gender={gender} onSearchChange={setSearchTerm} onTimeRangeChange={setTimeRange} onAgeGroupChange={setAgeGroup} onGenderChange={setGender}/>

      <DiseasePrevalenceTable_1.default filteredData={filteredData} totalCount={totalCount} onViewDetails={handleViewDetails}/>
    </div>);
};
exports.default = DiseasePrevalencePage;
