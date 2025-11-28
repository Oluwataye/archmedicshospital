"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDiseasePrevalence = void 0;
var react_1 = require("react");
var sonner_1 = require("sonner");
// Sample disease prevalence data
var diseasePrevalenceData = [
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
var useDiseasePrevalence = function () {
    var _a = (0, react_1.useState)(''), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = (0, react_1.useState)('all'), timeRange = _b[0], setTimeRange = _b[1];
    var _c = (0, react_1.useState)('all'), ageGroup = _c[0], setAgeGroup = _c[1];
    var _d = (0, react_1.useState)('all'), gender = _d[0], setGender = _d[1];
    // Filter data based on selected filters and search term
    var filteredData = diseasePrevalenceData.filter(function (item) {
        var matchesSearch = item.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase());
        var matchesTimeRange = timeRange === 'all' ||
            (timeRange === 'current' && item.period === '2025 Q1');
        var matchesAgeGroup = ageGroup === 'all' ||
            item.ageGroup.toLowerCase().includes(ageGroup.toLowerCase());
        var matchesGender = gender === 'all' ||
            item.gender.toLowerCase() === gender.toLowerCase() ||
            item.gender.toLowerCase() === 'all';
        return matchesSearch && matchesTimeRange && matchesAgeGroup && matchesGender;
    });
    // Handle export report
    var handleExportReport = function () {
        sonner_1.toast.success('Disease prevalence report exported successfully');
        // In a real application, this would generate a PDF or CSV file
    };
    // Handle view details
    var handleViewDetails = function (id) {
        sonner_1.toast.info("Viewing details for disease prevalence ".concat(id));
        // In a real application, this would open a modal or navigate to a details page
    };
    return {
        searchTerm: searchTerm,
        setSearchTerm: setSearchTerm,
        timeRange: timeRange,
        setTimeRange: setTimeRange,
        ageGroup: ageGroup,
        setAgeGroup: setAgeGroup,
        gender: gender,
        setGender: setGender,
        filteredData: filteredData,
        totalCount: diseasePrevalenceData.length,
        handleExportReport: handleExportReport,
        handleViewDetails: handleViewDetails
    };
};
exports.useDiseasePrevalence = useDiseasePrevalence;
