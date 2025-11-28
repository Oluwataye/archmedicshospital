"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var select_1 = require("@/components/ui/select");
var recharts_1 = require("recharts");
var PatientStatisticsPage = function () {
    var _a = (0, react_1.useState)('month'), timeRange = _a[0], setTimeRange = _a[1];
    var _b = (0, react_1.useState)('all'), department = _b[0], setDepartment = _b[1];
    // Sample data for charts
    var patientAdmissionsData = [
        { name: 'Jan', admissions: 120 },
        { name: 'Feb', admissions: 135 },
        { name: 'Mar', admissions: 145 },
        { name: 'Apr', admissions: 130 },
        { name: 'May', admissions: 150 },
        { name: 'Jun', admissions: 158 },
        { name: 'Jul', admissions: 162 },
        { name: 'Aug', admissions: 145 },
        { name: 'Sep', admissions: 140 },
        { name: 'Oct', admissions: 155 },
        { name: 'Nov', admissions: 165 },
        { name: 'Dec', admissions: 170 },
    ];
    var averageLengthOfStayData = [
        { name: 'Jan', days: 5.2 },
        { name: 'Feb', days: 4.9 },
        { name: 'Mar', days: 5.1 },
        { name: 'Apr', days: 4.8 },
        { name: 'May', days: 5.0 },
        { name: 'Jun', days: 4.7 },
        { name: 'Jul', days: 4.5 },
        { name: 'Aug', days: 4.6 },
        { name: 'Sep', days: 4.8 },
        { name: 'Oct', days: 5.0 },
        { name: 'Nov', days: 4.9 },
        { name: 'Dec', days: 5.2 },
    ];
    var patientDemographicsData = [
        { name: '0-18', value: 15 },
        { name: '19-35', value: 25 },
        { name: '36-50', value: 30 },
        { name: '51-65', value: 20 },
        { name: '66+', value: 10 },
    ];
    var COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Statistics</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Health Records</span>
            <span className="mx-2">›</span>
            <span>Reports</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">Patient Statistics</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button_1.Button variant="outline" className="flex items-center gap-2">
            <lucide_react_1.FileText className="h-4 w-4"/> Export Report
          </button_1.Button>
        </div>
      </div>

      {/* Filters */}
      <card_1.Card>
        <card_1.CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <lucide_react_1.Calendar className="h-4 w-4 text-gray-500"/>
            <span className="text-sm font-medium">Time Period:</span>
          </div>
          <select_1.Select value={timeRange} onValueChange={setTimeRange}>
            <select_1.SelectTrigger className="w-40">
              <select_1.SelectValue placeholder="Select range"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              <select_1.SelectItem value="week">This Week</select_1.SelectItem>
              <select_1.SelectItem value="month">This Month</select_1.SelectItem>
              <select_1.SelectItem value="quarter">This Quarter</select_1.SelectItem>
              <select_1.SelectItem value="year">This Year</select_1.SelectItem>
            </select_1.SelectContent>
          </select_1.Select>
          
          <div className="flex items-center gap-2 ml-0 md:ml-4">
            <lucide_react_1.Filter className="h-4 w-4 text-gray-500"/>
            <span className="text-sm font-medium">Department:</span>
          </div>
          <select_1.Select value={department} onValueChange={setDepartment}>
            <select_1.SelectTrigger className="w-40">
              <select_1.SelectValue placeholder="All Departments"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              <select_1.SelectItem value="all">All Departments</select_1.SelectItem>
              <select_1.SelectItem value="cardiology">Cardiology</select_1.SelectItem>
              <select_1.SelectItem value="neurology">Neurology</select_1.SelectItem>
              <select_1.SelectItem value="pediatrics">Pediatrics</select_1.SelectItem>
              <select_1.SelectItem value="orthopedics">Orthopedics</select_1.SelectItem>
              <select_1.SelectItem value="oncology">Oncology</select_1.SelectItem>
            </select_1.SelectContent>
          </select_1.Select>
        </card_1.CardContent>
      </card_1.Card>

      {/* Patient Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <card_1.Card>
          <card_1.CardContent className="p-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <lucide_react_1.Users className="h-8 w-8 text-blue-500"/>
            </div>
            <h3 className="text-3xl font-bold text-center">1,247</h3>
            <p className="text-gray-500 text-center mt-2">Total Patients</p>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <lucide_react_1.Users className="h-8 w-8 text-green-500"/>
            </div>
            <h3 className="text-3xl font-bold text-center">85</h3>
            <p className="text-gray-500 text-center mt-2">New Patients This Month</p>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardContent className="p-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
              <lucide_react_1.Clock className="h-8 w-8 text-purple-500"/>
            </div>
            <h3 className="text-3xl font-bold text-center">4.8</h3>
            <p className="text-gray-500 text-center mt-2">Average Length of Stay (Days)</p>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Admissions Chart */}
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <lucide_react_1.BarChart className="h-5 w-5 text-blue-500 mr-2"/>
              Patient Admissions
            </h3>
            <div className="h-72">
              <recharts_1.ResponsiveContainer width="100%" height="100%">
                <recharts_1.BarChart data={patientAdmissionsData}>
                  <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                  <recharts_1.XAxis dataKey="name"/>
                  <recharts_1.YAxis />
                  <recharts_1.Tooltip />
                  <recharts_1.Bar dataKey="admissions" fill="#3B82F6"/>
                </recharts_1.BarChart>
              </recharts_1.ResponsiveContainer>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Average Length of Stay Chart */}
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <lucide_react_1.Clock className="h-5 w-5 text-purple-500 mr-2"/>
              Average Length of Stay
            </h3>
            <div className="h-72">
              <recharts_1.ResponsiveContainer width="100%" height="100%">
                <recharts_1.LineChart data={averageLengthOfStayData}>
                  <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                  <recharts_1.XAxis dataKey="name"/>
                  <recharts_1.YAxis />
                  <recharts_1.Tooltip />
                  <recharts_1.Line type="monotone" dataKey="days" stroke="#8884d8"/>
                </recharts_1.LineChart>
              </recharts_1.ResponsiveContainer>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Age Demographics Chart */}
        <card_1.Card>
          <card_1.CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <lucide_react_1.Users className="h-5 w-5 text-green-500 mr-2"/>
              Age Demographics
            </h3>
            <div className="h-72">
              <recharts_1.ResponsiveContainer width="100%" height="100%">
                <recharts_1.PieChart>
                  <recharts_1.Pie data={patientDemographicsData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={function (_a) {
        var name = _a.name, percent = _a.percent;
        return "".concat(name, ": ").concat((percent * 100).toFixed(0), "%");
    }}>
                    {patientDemographicsData.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={COLORS[index % COLORS.length]}/>); })}
                  </recharts_1.Pie>
                  <recharts_1.Tooltip />
                  <recharts_1.Legend />
                </recharts_1.PieChart>
              </recharts_1.ResponsiveContainer>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
};
exports.default = PatientStatisticsPage;
